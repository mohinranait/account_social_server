const { Schema, model } = require("mongoose");

const fileSchema = new Schema({
    fileType: {
        type: String,
        default: 'post',
        enum: ['post', "profile", 'cover'],
    },
    fileUrl: {
        type: String,
    },
}, { timestamps: true });

const FileType = model('FileType', fileSchema);

module.exports = FileType;