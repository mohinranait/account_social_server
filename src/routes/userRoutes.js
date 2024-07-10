const userRoute = require("express").Router();
const { getSingleUserById, getAllUsers, updatePorfileById } = require("../controllers/UserController");
const checkAuth = require("../middleware/checkedAuth");
const isLogin = require("../middleware/checkedLogin");


userRoute.get('/single/:id', isLogin, getSingleUserById)
userRoute.get('/all', isLogin, getAllUsers)
userRoute.patch('/update', isLogin, checkAuth, updatePorfileById)


module.exports = userRoute;