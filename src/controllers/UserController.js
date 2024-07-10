const { isoStringDateFormat } = require("../helpers/dateFormater");
const { successResponse } = require("../helpers/responsHandler");
const User = require("../models/UserModal")
const createError = require("http-errors");
const mongoose = require('mongoose')

// get single user by ID
const getSingleUserById = async (req, res, next) => {
    try {

        const userId = req.params?.id;
        // mongoose id Validation
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw createError(400, 'Invalid user ID');
        }
        const user = await User.findById(userId).select('-password').populate('profileImage coverImage');
        if (!user) throw createError(404, 'not-found');

        // send success response 
        return successResponse(res, {
            message: 'user',
            statusCode: 200,
            payload: {
                user,
            }
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
        const { website, profileTitle, homeTown, currentCity, isMarried, day, defaultPhone, profileUrl, month, year, gender, firstName, lastName } = req.body;

        // Find exists user
        const existsUser = await User.findById(userId);
        if (!existsUser) throw createError(404, "User not-found");



        let fName = firstName || existsUser?.name?.firstName;
        let lName = lastName || existsUser?.name?.lastName;
        let d = day || existsUser?.birthday?.day;
        let m = month || existsUser?.birthday?.month;
        let y = year || existsUser?.birthday?.year;
        // Update user format
        let userObj = {

            name: {
                firstName: fName,
                lastName: lName,
                fullName: fName + " " + lName,
            },
            gender,
            defaultPhone,
            profileUrl,
            website,
            profileTitle,
            homeTown,
            currentCity,
            isMarried,
            birthday: {
                day: d,
                month: m,
                year: y,
                date: isoStringDateFormat(`${d} ${m} ${y}`)
            }
        };

        const user = await User.findByIdAndUpdate(userId, userObj, { new: true, runValidators: true }).select('-password');
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
        const users = await User.find({}).select('-password');

        // send success response 
        return successResponse(res, {
            message: 'users',
            statusCode: 200,
            payload: {
                users,
            }
        })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getSingleUserById,
    getAllUsers,
    updatePorfileById
}