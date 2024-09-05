require('dotenv').config()
const serverPort = process.env.PORT;

const mongoDbUri = process.env.DATABASE_URL;

const jwtSecret = process.env.JWT_SECRET;
const productionMode = process.env.NODE_ENV

module.exports = {
    serverPort,
    mongoDbUri,
    jwtSecret,
    productionMode,
}