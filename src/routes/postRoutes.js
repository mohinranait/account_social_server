const postRouter = require("express").Router();
const isLogin = require("../middleware/checkedLogin");
const { createNewPost, deletePost, getAllPosts, updatePostById } = require("../controllers/PostController");
const isOwner = require("../middleware/isOwner");



postRouter.post('/create', isLogin, createNewPost)
postRouter.get('/all', isLogin, getAllPosts)
postRouter.patch('/update/:id', isLogin, updatePostById)
postRouter.delete('/delete/:id', isLogin, deletePost)

module.exports = postRouter;