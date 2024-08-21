const mongoose = require('mongoose');
const cloudinary = require('../config/utils/cloudinary');
const Media = require('../models/FileModal');
const createError = require('http-errors');
const { successResponse } = require('../helpers/responsHandler');


// Update profile by ID
const uploadImageService = async (req, res, next) => {
    try {

        const image = req.file?.path;


        // upload profile image
        const imageRes = await cloudinary.uploader.upload(image, {
            folder: 'social_app',
        })
        console.log("image cloudinary", imageRes);

        const { url, format, width, height, bytes } = imageRes;


        const file = await Media.create({
            fileType: "profile",
            fileUrl: url,
            width,
            height,
            extension: format,
            size: bytes,
        })




        return successResponse(res, {
            statusCode: 200,
            message: "Image uploaded",
            payload: {
                file
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

module.exports = {
    uploadImageService
}