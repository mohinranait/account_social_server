const { successResponse } = require("../helpers/responsHandler");
const Post = require("../models/PostModal");
const createError = require("http-errors");
const User = require("../models/UserModal");
const { isValidObjectId } = require("../helpers/helpers");
const Invitation = require("../models/InvitationModal");


// Create new psot
const createNewPost = async (req, res, next) => {
    try {

        const body = req.body;
        const post = await Post.create({ ...body });


        return successResponse(res, {
            statusCode: 201,
            message: 'created',
            payload: {
                post,
            }
        })
    } catch (error) {
        next(error)
    }
}

// get all posts
const getAllPosts = async (req, res, next) => {
    try {
        const userId = req?.user?.id;
        let postType = req?.query?.postType // userWishPosts
        let userWishPosts = req?.query?.query // userWishPosts


        let query = {};
        let posts = [];

        if (isValidObjectId(userWishPosts)) {

            const getFriendInvitasion = await Invitation.findOne({
                $or: [
                    { senderId: userId, reciverId: userWishPosts },
                    { senderId: userWishPosts, reciverId: userId },
                ]
            })




            query.owner = {
                $eq: userWishPosts,
            }

            if (userWishPosts == userId) {
                query.$or = [
                    {
                        status: { $in: ["Onlyme", "Public", "Friends"] },
                        owner: userId,
                    },
                ]
            } else {
                if (getFriendInvitasion) {
                    if (getFriendInvitasion?.requestStatus == 'friend') {
                        query.$or = [
                            {
                                status: { $in: ["Public", 'Friends'] },
                            },
                        ]
                    } else if (getFriendInvitasion.requestStatus === 'pending') {
                        query.$or = [
                            {
                                status: { $in: ["Public"] },
                            }
                        ];
                    }
                } else {
                    query.$or = [
                        { status: { $in: ["Public"] }, },
                    ]
                }
            }






            posts = await Post.find(query).sort({ updatedAt: -1 }).populate({
                path: 'owner',
                select: '_id profileUrl name.fullName',
                populate: {
                    path: 'profileImage',
                    select: '_id fileUrl'
                },
            }).populate({
                path: 'media',
                select: '_id fileType fileUrl extension'
            });

        }


        if (userWishPosts == 'all') {
            const getFriendsInvitasions = await Invitation.find({
                $or: [
                    { senderId: userId },
                    { reciverId: userId },
                ],
                requestStatus: 'friend'
            })

            let friendsIds = getFriendsInvitasions?.map(invite => invite?.reciverId.toString() == userId ? invite?.senderId.toString() : invite?.reciverId.toString())
            friendsIds.push(userId)


            query.$or = [
                {
                    owner: { $in: friendsIds },
                    status: { $eq: "Friends" },
                },
                { status: 'Public' },
                {
                    status: "Private",
                    owner: userId,
                }
            ];


            let randomPosts = await Post.aggregate([
                { $match: query },
                { $sample: { size: 10 } },
                { $sort: { updatedAt: -1 } }
            ])

            posts = await Post.populate(randomPosts, [
                {
                    path: 'owner',
                    select: '_id profileUrl name.fullName',
                    populate: {
                        path: 'profileImage',
                        select: '_id fileUrl'
                    },
                },
                {
                    path: 'media',
                    select: '_id fileType fileUrl extension'
                }
            ])

            // posts = await Post.find(query).populate({
            //     path: 'owner',
            //     select: '_id profileUrl name.fullName',
            //     populate: {
            //         path: 'profileImage',
            //         select: '_id fileUrl'
            //     },
            // }).populate({
            //     path: 'media',
            //     select: '_id fileType fileUrl extension'
            // }).sort({ updatedAt: -1 });
        }


        return successResponse(res, {
            statusCode: 200,
            message: 'success',
            payload: {
                posts,
            }
        })

    } catch (error) {
        next(error)
    }
}


// update posts by ID 
const updatePostById = async (req, res, next) => {
    try {
        const { postReaction } = req.body;
        const postId = req.params?.id;
        let query = {};


        if (postReaction) {

            const existingPost = await Post.findOne({ _id: postId, 'postReaction.userId': postReaction.userId, })

            if (existingPost) {
                query = {
                    $set: {
                        'postReaction.$[elem].type': postReaction.type,
                        'postReaction.$[elem].data': postReaction.data
                    }
                };
                const options = {
                    arrayFilters: [{ 'elem.userId': postReaction.userId }],
                    new: true,
                    runValidators: true
                };
                const post = await Post.findByIdAndUpdate(postId, query, options);
                if (!post) throw createError(404, "Post not found");

                return successResponse(res, {
                    statusCode: 200,
                    message: 'Post updated successfully',
                    payload: { post }
                });
            } else {

                query = {
                    $push: {
                        postReaction: {
                            type: postReaction.type,
                            data: postReaction.data,
                            userId: postReaction.userId,
                            postId: postId
                        }
                    }
                }

            }
        }

        // console.log(query);

        const post = await Post.findByIdAndUpdate(postId, query, { new: true, runValidators: true })
        if (!post) throw createError(404, "Not found")

        return successResponse(res, {
            statusCode: 201,
            message: 'created',
            payload: { post }
        })
    } catch (error) {
        next(error)
    }
}


// Delete posts by ID 
const deletePost = async (req, res, next) => {
    try {

        const postId = req.params?.id;

        // delete post by ID
        const post = await Post.findByIdAndDelete(postId);

        // post not found error
        if (!post) throw createError(404, 'not-found')


        // send delete response
        return successResponse(res, {
            statusCode: 200,
            message: 'deleted',
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createNewPost,
    getAllPosts,
    updatePostById,
    deletePost,
}