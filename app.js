const express = require('express');
const { serverPort } = require('./src/config/secretEnv');
const { connectDb } = require('./src/config/db/mongoDb');
const { authRouter, userRoute, postRouter, inviteRoute, chatRoute } = require('./src/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const rateLimit = require("express-rate-limit")
const createError = require('http-errors');
const { errorResponse } = require('./src/helpers/responsHandler');
const http = require('http');
const { Server } = require("socket.io")


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



// Socket server create
const expressServer = http.createServer(app)
const io = new Server(expressServer, {
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
})
let activeUsers = [];
io.on('connection', (socket) => {
    console.log("Add new user", socket.id);


    socket.on('addNewUser', (data) => {
        const userId = data?.userId;

        if (!activeUsers?.some(x => x.userId === userId)) {
            activeUsers.push({
                userId,
                socketId: socket.id,
            })
        }
        console.log(activeUsers);
    })


    socket.on('addMessage', (data) => {
        const { reciverId, message } = data;
        const user = activeUsers?.find(user => user?.userId == reciverId)
        console.log("Data", data);
        if (user) {
            console.log('Send Emait');
            socket.to(user?.socketId).emit('messageReceive', message)
        }
    })

    socket.on('disconnect', () => {
        activeUsers = activeUsers?.filter(user => user.socketId !== socket.id)
        console.log("user disconnect");
    })
})

module.exports = expressServer;