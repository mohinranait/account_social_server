const { Schema, Types, model } = require('mongoose')

const messageSchema = new Schema({
    senderId: {
        type: Types.ObjectId,
        ref: "User",
    },
    reciverId: {
        type: Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        default: null,
    },
    messageType: {
        type: String,
        default: 'text',
        enum: ['file', 'text']
    },
    readMessage: {
        type: Boolean,
        default: false,
    },
    readTime: {
        type: Date,
        default: null,
    },
}, { timestamps: true })

const Message = model("Message", messageSchema);

module.exports = Message;