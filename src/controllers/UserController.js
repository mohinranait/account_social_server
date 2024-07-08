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
        const user = await User.findById(userId).select('-password');
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
}