require('dotenv').config()
const serverPort = process.env.PORT;

const mongoDbUri = process.env.DATABASE_URL;

module.exports = {
    serverPort,
    mongoDbUri
}