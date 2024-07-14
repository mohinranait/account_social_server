const postRouter = require("express").Router();
const isLogin = require("../middleware/checkedLogin");
const { createNewPost, deletePost, getAllPosts } = require("../controllers/PostController");
const isOwner = require("../middleware/isOwner");



postRouter.post('/create', isLogin, createNewPost)
postRouter.delete('/delete/:id', isLogin, deletePost)
postRouter.get('/all', isLogin, getAllPosts)

module.exports = postRouter;