const { Schema, model, Types } = require('mongoose');

const postSchema = new Schema({
    media: {
        type: Types.ObjectId,
        ref: 'Media',
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
    },
    withFiiends: {
        type: Array,
    },
    isFelling: {
        type: String,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private', 'firends', 'colaborate']
    },
    postReaction: [
        {
            type: {
                type: String, // love, like
                enum: ['love', 'like', 'dislike', 'happy', 'sad'], // Extend this as needed
            },
            data: {
                type: String,
            },
            userId: {
                type: Types.ObjectId,
                ref: 'User',
            }
        }
    ],
    actions: {
        share: {
            type: Boolean,
            default: true,
            enum: [true, false]
        },
        copy: {
            type: Boolean,
            default: true,
            enum: [true, false]
        },
        reaction: {
            type: Boolean,
            default: true,
            enum: [true, false]
        },
        comment: {
            type: Boolean,
            default: true,
            enum: [true, false]
        },

    },
    hideForUser: {
        type: Array,
        default: []
    },
}, { timestamps: true })



const Post = model("Post", postSchema);
module.exports = Post;