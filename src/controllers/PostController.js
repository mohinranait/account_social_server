const { successResponse } = require("../helpers/responsHandler");
const Post = require("../models/PostModal");
const createError = require("http-errors");


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
        let query = {};

        const posts = await Post.find({}).populate({
            path: 'owner',
            select: '_id profileUrl name.fullName'
        });
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
    deletePost,
    getAllPosts,
}