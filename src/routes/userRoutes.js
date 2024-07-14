const userRoute = require("express").Router();
const { getAllUsers, updatePorfileById, getSingleUser } = require("../controllers/UserController");
const isLogin = require("../middleware/checkedLogin");
const isOwner = require("../middleware/isOwner");


userRoute.get('/single', isLogin, getSingleUser)
userRoute.get('/all', isLogin, getAllUsers)
userRoute.patch('/update', isLogin, isOwner, updatePorfileById)


module.exports = userRoute;