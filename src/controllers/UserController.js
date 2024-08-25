const cloudinary = require("../config/utils/cloudinary");
const { isoStringDateFormat } = require("../helpers/dateFormater");
const { successResponse } = require("../helpers/responsHandler");
const User = require("../models/UserModal")
const createError = require("http-errors");
const mongoose = require('mongoose');
const Media = require("../models/FileModal");
const Post = require("../models/PostModal");
const Invitation = require("../models/InvitationModal");

// get single user 
const getSingleUser = async (req, res, next) => {
    try {

        const { userId, profileUrl, email } = req.query;

        let query = {};



        if (userId) {
            query._id = userId;
        }

        if (profileUrl) {
            query.profileUrl = profileUrl
        }

        if (email) {
            query.email = email
        }



        const user = await User.findOne(query).select('-password').populate('profileImage').populate('coverImage');
        if (!user) throw createError(404, 'not-found');



        // send success response 
        // return successResponse(res, {
        //     message: 'user',
        //     statusCode: 200,
        //     payload: {
        //         user,
        //     }
        // })

        res.status(200).send({
            message: "user",
            success: true,
            payload: { user }
        })

    } catch (error) {
        // mongoose ID validation
        if (error instanceof mongoose.Error) {
            return next(createError(400, "Invalid user ID"))
        }
        next(error)
    }
}


// Update profile by ID
const updatePorfileById = async (req, res, next) => {
    try {

        const userId = req?.user?.id;
        const { website, profileTitle, homeTown, isRelation, currentCity, socialMedia, isMarried, day, defaultPhone, profileUrl, month, year, gender, firstName, lastName } = req.body;
        const image = req.file?.path;



        // Find exists user
        const existsUser = await User.findById(userId);
        if (!existsUser) throw createError(404, "User not-found");



        let fName = firstName || existsUser?.name?.firstName;
        let lName = lastName || existsUser?.name?.lastName;
        let d = day || existsUser?.birthday?.day;
        let m = month || existsUser?.birthday?.month;
        let y = year || existsUser?.birthday?.year;


        // Update user format
        const updateObj = {};
        if (firstName || lastName) {
            updateObj.name = {
                firstName: firstName || existsUser?.name?.firstName,
                lastName: lastName || existsUser?.name?.lastName,
                fullName: `${firstName || existsUser?.name?.firstName} ${lastName || existsUser?.name?.lastName}`
            };
        }
        if (gender) {
            updateObj.gender = gender;
        }
        if (defaultPhone) {
            updateObj.defaultPhone = defaultPhone;
        }
        // if (profileUrl) {
        //     updateObj.profileUrl = profileUrl;
        // }
        if (website) {
            updateObj.website = website;
        }
        if (profileTitle) {
            updateObj.profileTitle = profileTitle;
        }
        if (homeTown) {
            updateObj.homeTown = {
                value: homeTown.value || existsUser?.homeTown?.value,
                status: homeTown.status || existsUser?.homeTown?.status
            };
        }

        // If currentCity is existis 
        if (currentCity) {
            updateObj.currentCity = {
                value: currentCity.value || existsUser?.currentCity?.value,
                status: currentCity.status || existsUser?.currentCity?.status
            };
        }
        if (isMarried) {
            updateObj.isMarried = isMarried;
        }
        if (isRelation) {
            updateObj.isRelation = {
                relationType: isRelation.relationType || existsUser?.isRelation?.relationType,
                withRelation: isRelation.withRelation || existsUser?.isRelation?.withRelation,
                year: isRelation.year || existsUser?.isRelation?.year,
                month: isRelation.month || existsUser?.isRelation?.month,
                day: isRelation.day || existsUser?.isRelation?.day,
                status: isRelation.status || existsUser?.isRelation?.status
            };
        }
        if (day || month || year) {
            updateObj.birthday = {
                day: day || existsUser?.birthday?.day,
                month: month || existsUser?.birthday?.month,
                year: year || existsUser?.birthday?.year,
                date: isoStringDateFormat(`${day || existsUser?.birthday?.day} ${month || existsUser?.birthday?.month} ${year || existsUser?.birthday?.year}`)
            };
        }


        // If update social media
        if (socialMedia?.length > 0) {
            let newArr = [];
            [...socialMedia, ...existsUser.socialMedia]?.forEach(item => {
                let existsValue = newArr.find(i => i?.type == item?.type);
                if (existsValue?.type !== item?.type) {
                    newArr.push(item)
                }
            })
            updateObj.socialMedia = newArr
        }



        // If website is comming
        if (website?.length > 0) {
            updateObj.website = website;
        }






        // upload profile image
        if (image) {

            const imageRes = await cloudinary.uploader.upload(image, {
                folder: 'social_app',
            })
            const { url, format, width, height, bytes } = imageRes;


            const file = await Media.create({
                fileType: "profile",
                fileUrl: url,
                width,
                height,
                extension: format,
                size: bytes,
            })

            if (file?._id) {
                updateObj.profileImage = file?._id;
            }

            const post = await Post.create({
                owner: userId,
                media: file?._id,
            })


        }



        const user = await User.findByIdAndUpdate(userId, updateObj, { new: true, upsert: true, runValidators: true }).select('-password').populate("profileImage coverImage");
        if (!user) throw createError(404, "Update request are faild");



        return successResponse(res, {
            statusCode: 200,
            message: "Profile updated",
            payload: {
                user
            }
        })

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error) {
            return next(createError(400, "Invalid user ID"))
        }
        next(error)
    }
}

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const search = req.query?.search || '';
        const getUsersActions = req?.query?.querytype || '' // suggestions, friends, followers,newRequest, all,
        const userId = req?.user?.id;


        let searchReg = new RegExp('.*' + search + '.*', 'i')
        let query = {};


        // for search user
        if (search.trim() !== '') {
            query.$or = [
                {
                    "name.fullName": { $regex: searchReg }
                }
            ]
        }

        let options = { password: 0 }


        let users = []

        // get followers users
        if (getUsersActions === 'followers') {
            const followers = Invitation.find({ reciverId: userId, requestStatus: { $in: ['pending', 'friend'] } })
            // Fetch friends based on the query
            query._id = { $ne: userId, }
            users = await User.find(query)
                .select('-password')
                .populate('profileImage');
        }





        // get Friends users
        if (getUsersActions === 'friends') {


            const invitations = await Invitation.find({
                $or: [
                    { reciverId: userId },
                    { senderId: userId },
                ],
                requestStatus: 'friend'
            })

            let findSenderIds = invitations.map(invitation => {
                if (invitation.reciverId.toString() == userId) {
                    return invitation.senderId.toString()
                } else {
                    return invitation.reciverId.toString()
                }
            });


            // Fetch friends based on the query
            query._id = { $in: findSenderIds, }

            console.log(query);

            users = await User.find(query)
                .select('-password')
                .populate('profileImage');
        }

        // get suggestions users
        if (getUsersActions === 'suggestions') {

            let invitations = await Invitation.find({
                $or: [
                    { senderId: userId },
                    { reciverId: userId },
                ]
            });

            let findSenderIds = invitations.map(invitation => {
                if (invitation.reciverId.toString() == userId) {
                    return invitation.senderId.toString()
                } else {
                    return invitation.reciverId.toString()
                }
            });


            findSenderIds.push(userId.toString());

            query._id = { $nin: findSenderIds };

            users = await User.find(query)
                .select('-password')
                .populate('profileImage');
        }

        // final step 
        // if (users?.length == 0) {
        //     users = await User.find(query).select('-password').populate('profileImage')
        // }
        // send success response 
        return successResponse(res, {
            message: 'users',
            statusCode: 200,
            payload: {
                users
            }
        })
    } catch (error) {
        next(error)
    }
}



const getNewFriendRequests = async (req, res, next) => {
    try {
        const userId = req?.user?.id;

        const followers = await Invitation.find({
            reciverId: userId,
            requestStatus: 'pending'
        }).populate({
            path: 'senderId',
            select: '-password'
        });

        return successResponse(res, {
            message: 'followers',
            statusCode: 200,
            payload: {
                followers
            }
        })

    } catch (error) {
        next(error)
    }
}

// get all followers
const getAllFollowingFriends = async (req, res, next) => {
    try {
        const userId = req?.user?.id;

        const followings = await Invitation.find({
            senderId: userId,
            requestStatus: 'pending'
        }).populate({
            path: 'reciverId',
            select: '-password'
        });

        return successResponse(res, {
            message: 'followings',
            statusCode: 200,
            payload: {
                followings
            }
        })

    } catch (error) {
        next(error)
    }
}


// Profile statics
const getProfileStatics = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        // Total Followers
        const totalFollower = await Invitation.countDocuments({
            $or: [
                { senderId: userId },
                { reciverId: userId },
            ],
            reciverId: userId,
        });

        // Total Following
        const totalFollowing = await Invitation.countDocuments({
            $or: [
                { senderId: userId },
                { reciverId: userId },
            ],
            senderId: userId,
        });

        // Friend invitations 
        const getFriendInvitations = await Invitation.find({
            $or: [
                { senderId: userId },
                { reciverId: userId },
            ],
            requestStatus: 'friend',
        })

        const friendsIds = getFriendInvitations?.map(invite => invite.reciverId.toString() == userId ? invite.senderId.toString() : invite.reciverId.toString())
        const formateIds = friendsIds.map(id => new mongoose.Types.ObjectId(id));

        const friends = await User.aggregate([
            { $match: { _id: { $in: formateIds } } },
            { $sample: { size: 3 } },
            { $project: { password: 0, email: 0 } }
        ])




        return successResponse(res, {
            message: "Profile statics",
            payload: {
                totalFollower,
                totalFollowing,
                friends,
            }
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    updatePorfileById,
    getAllUsers,
    getSingleUser,
    getNewFriendRequests,
    getAllFollowingFriends,
    getProfileStatics,
}