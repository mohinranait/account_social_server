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
        enum: ['pending', 'accepted', 'rejected', 'cancel']
    }
}, { timestamps: true });

const Invitation = model("Invitation", invitationSchema);
module.exports = Invitation;