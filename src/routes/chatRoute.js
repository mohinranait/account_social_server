const { sendMessage } = require("../controllers/ChatController");
// const isLogin = require("../middleware/checkedLogin");

const chatRoute = require("express").Router();


chatRoute.post('/send', sendMessage)

module.exports = chatRoute;