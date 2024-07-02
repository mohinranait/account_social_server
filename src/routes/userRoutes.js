const userRoute = require("express").Router();
const { getSingleUserById, getAllUsers } = require("../controllers/UserController");
const isLogin = require("../middleware/checkedLogin");


userRoute.get('/single/:id', isLogin, getSingleUserById)
userRoute.get('/all', isLogin, getAllUsers)


module.exports = userRoute;