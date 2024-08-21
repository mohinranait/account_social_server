const authRouter = require("./authRoutes");
const chatRoute = require("./chatRoute");
const inviteRoute = require("./invitationRoute");
const postRouter = require("./postRoutes");
const uploadImageRouter = require("./uploadRouter");
const userRoute = require("./userRoutes");



module.exports = {
    authRouter,
    userRoute,
    postRouter,
    inviteRoute,
    chatRoute,
    uploadImageRouter
}