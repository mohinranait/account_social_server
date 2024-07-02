const postRouter = require("express").Router();
const isLogin = require("../middleware/checkedLogin");
const { createNewPost, deletePost, getAllPosts } = require("../controllers/PostController");
const checkAuth = require("../middleware/checkedAuth");



postRouter.post('/create', isLogin, checkAuth, createNewPost)
postRouter.delete('/delete/:id', isLogin, checkAuth, deletePost)
postRouter.get('/all', isLogin, checkAuth, getAllPosts)

module.exports = postRouter;