const { sendMessage, getMessage, getAllConvenstions } = require("../controllers/ChatController");
const isLogin = require("../middleware/checkedLogin");

const chatRoute = require("express").Router();


chatRoute.post('/send/:id', isLogin, sendMessage)
chatRoute.get('/allmessage/:id', isLogin, getMessage)
chatRoute.get('/conversations/:id', isLogin, getAllConvenstions)

module.exports = chatRoute;