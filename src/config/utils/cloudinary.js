
const cloudinary = require('cloudinary').v2
require('dotenv').config()


cloudinary.config({
    cloud_name: 'dm9s5d3xk',
    api_key: '772929585163915',
    api_secret: '_ThV9Cz20zfUCmYhY8i8etsh5sg'
});

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET
// });

module.exports = cloudinary


