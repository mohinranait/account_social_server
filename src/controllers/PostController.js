const Post = require("../models/PostModal");

// Create new psot
const createNewPost = async (req, res) => {
    try {

        const body = req.body;
        const post = await Post.create({ ...body, owner: ownerId });
        res.status(201).send({
            success: true,
            message: 'created',
            post,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

// get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).send({
            success: true,
            message: 'success',
            posts,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

// Delete posts by ID 
const deletePost = async (req, res) => {
    try {

        const postId = req.params?.id;
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).send({
                success: false,
                message: 'not-found',
            })
        }
        res.status(200).send({
            success: true,
            message: 'deleted',
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createNewPost,
    deletePost,
    getAllPosts,
}