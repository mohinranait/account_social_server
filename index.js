const express = require('express');
const { serverPort } = require('./src/config/secretEnv');
const { connectDb } = require('./src/config/db/mongoDb');
const { authRouter } = require('./src/routes');




const app = express();


app.use('/api/user', authRouter)

app.get('/', (req, res) => {
    res.send('Home route is working')
});

app.listen(5000, () => {
    connectDb()
    console.log(`Server is running at port http://localhost:${serverPort}`)
})