require('dotenv').config()
const serverPort = process.env.PORT;

const mongoDbUri = process.env.DATABASE_URL;

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
    serverPort,
    mongoDbUri,
    jwtSecret,
}