const express = require('express');
const { serverPort } = require('./src/config/secretEnv');
const { connectDb } = require('./src/config/db/mongoDb');
const { authRouter, userRoute, postRouter } = require('./src/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const app = express();

// DB connect
connectDb()


// middleware
app.use(express.json());
app.use(cors())
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use('/api/user', userRoute)
app.use('/api/post', postRouter)

app.get('/', (req, res) => {
    res.send('Home route is working')
});

app.listen(5000, () => {

    console.log(`Server is running at port http://localhost:${serverPort}`)
})