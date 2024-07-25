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
}, { timestamps: true })

const Message = model("Message", messageSchema);

module.exports = Message;