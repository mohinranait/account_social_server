const express = require('express');
const { serverPort } = require('./src/config/secretEnv');
const { connectDb } = require('./src/config/db/mongoDb');
const { authRouter, userRoute, postRouter, inviteRoute, chatRoute } = require('./src/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const rateLimit = require("express-rate-limit")
const createError = require('http-errors');
const { errorResponse } = require('./src/helpers/responsHandler');

const app = express();

// DB connect
connectDb()


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: 50,
    statusCode: 429,
    message: { message: 'Your request is rich. Try again' }
})
// middleware
app.use(limiter)
app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    })
)
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use('/api/user', userRoute)
app.use('/api/post', postRouter)
app.use('/api/invitation', inviteRoute)
app.use('/api/chat', chatRoute)

app.get('/', (req, res) => {
    res.send('Home route is working')
});


// client error handle
app.use((req, res, next) => {
    next(createError(404, "route not found"))
})

// Server Error handle
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message,
    })
})

module.exports = app;