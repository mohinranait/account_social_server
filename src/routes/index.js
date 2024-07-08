const authRouter = require("./authRoutes");
const inviteRoute = require("./invitationRoute");
const postRouter = require("./postRoutes");
const userRoute = require("./userRoutes");



module.exports = {
    authRouter,
    userRoute,
    postRouter,
    inviteRoute,
}