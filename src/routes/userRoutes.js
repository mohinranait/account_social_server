const userRoute = require("express").Router();
const { getAllUsers, updatePorfileById, getSingleUser, getNewFriendRequests, getAllFollowingFriends } = require("../controllers/UserController");
const isLogin = require("../middleware/checkedLogin");
const isOwner = require("../middleware/isOwner");
const upload = require("../middleware/uploadFile");


userRoute.get('/single', isLogin, getSingleUser)
userRoute.get('/all', isLogin, getAllUsers)
userRoute.get('/new-friend-request', isLogin, getNewFriendRequests)
userRoute.get('/following', isLogin, getAllFollowingFriends)
userRoute.patch('/update', isLogin, isOwner, upload.single('file'), updatePorfileById)


module.exports = userRoute;