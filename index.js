const express = require('express');
const { serverPort } = require('./src/config/secretEnv');
const { connectDb } = require('./src/config/db/mongoDb');
const { authRouter } = require('./src/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const app = express();

// DB connect
connectDb()


// middleware
app.use(express.json());
app.use(cors())
app.use(cookieParser())


app.use('/api/user', authRouter)

app.get('/', (req, res) => {
    res.send('Home route is working')
});

app.listen(5000, () => {

    console.log(`Server is running at port http://localhost:${serverPort}`)
})