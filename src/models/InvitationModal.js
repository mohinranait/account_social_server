const { Schema, Types, model } = require("mongoose");

const invitationSchema = new Schema({
    senderId: {
        type: Types.ObjectId,
        ref: "User",
    },
    reciverId: {
        type: Types.ObjectId,
        ref: "User",
    },
    requestStatus: {
        type: String,
        default: "pending",
        enum: ['pending', 'friend']
    }
}, { timestamps: true });

const Invitation = model("Invitation", invitationSchema);
module.exports = Invitation;