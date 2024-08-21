const { successResponse } = require("../helpers/responsHandler");
const Post = require("../models/PostModal");
const createError = require("http-errors");
const User = require("../models/UserModal");
const { isValidObjectId } = require("../helpers/helpers");


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

        let postType = req?.query?.postType // userWishPosts
        let userWishPosts = req?.query?.query // userWishPosts


        let query = {};
        let posts = [];

        if (isValidObjectId(userWishPosts)) {


            query.owner = {
                $eq: userWishPosts
            }
            console.log('query', query);

            posts = await Post.find(query).sort({ updatedAt: -1 }).populate({
                path: 'owner',
                select: '_id profileUrl name.fullName'
            }).populate({
                path: 'media',
                select: '_id fileType fileUrl extension'
            });

        }


        if (userWishPosts == 'all') {
            posts = await Post.find(query).populate({
                path: 'owner',
                select: '_id profileUrl name.fullName'
            }).populate({
                path: 'media',
                select: '_id fileType fileUrl extension'
            }).sort({ updatedAt: -1 });
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