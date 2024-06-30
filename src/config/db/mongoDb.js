const mongoose = require('mongoose');
const { mongoDbUri } = require('../secretEnv');

const connectDb = async () => {
    try {
        await mongoose.connect(mongoDbUri)
        console.log("DB is connect");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    connectDb
}