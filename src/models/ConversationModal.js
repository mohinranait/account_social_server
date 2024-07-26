

const { Schema, Types, model, } = require('mongoose');

const conversationSchema = new Schema({
    participants: [
        {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    creatorId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    otherId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    messages: [
        {
            type: Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ]
}, { timestamps: true });

const Conversation = model('Conversation', conversationSchema);
module.exports = Conversation;