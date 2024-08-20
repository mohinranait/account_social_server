const mongoose = require("mongoose");
const { successResponse, errorResponse } = require("../helpers/responsHandler");
const Invitation = require("../models/InvitationModal");
const User = require("../models/UserModal");
const createError = require("http-errors");

// send new invitation
const sendNewInvitation = async (req, res, next) => {
    try {
        const senderId = req.user?.id;
        const reciverId = req.query?.reciverId;

        // invite sender
        const sender = await User.findById(senderId).select('_id email role')
        if (!sender) throw createError(404, 'Sender user not-found');

        // invite reciver
        const reciver = await User.findById(reciverId).select('_id email role')
        if (!reciver) throw createError(404, 'Reciver user not-found');


        // create new invitation request
        const invitation = await Invitation.create({
            senderId: sender?._id,
            reciverId: reciver?._id,
            requestStatus: 'pending',
        })

        return successResponse(res, {
            statusCode: 201,
            message: 'Send invitation',
            payload: {
                invitation,
            }
            // senderId,
        })
    } catch (error) {
        if (error instanceof mongoose.Error) {
            return next(createError(400, "Invalid user ID"))
        }
        next(error);
    }
}

// get all invitations
const getAllInvitations = async (req, res, next) => {
    try {

        const userId = req?.user?.id;
        let query = {
            reciverId: userId,
        };
        const invitations = await Invitation.find(query).populate(
            {
                path: 'senderId',
                select: 'name.fullName name.firstName gender',
                populate: 'profileImage coverImage'
            }
        );

        return successResponse(res, {
            statusCode: 200,
            message: 'All invitation',
            payload: {
                invitations,
            }
        })
    } catch (error) {
        if (error instanceof mongoose.Error) {
            return next(createError(400, "Invalid user ID"))
        }
        next(error);
    }
}

// Reciver route action
const invitationAccepted = async (req, res, next) => {
    try {
        const inviteId = req?.params?.id;

        // update 
        const invite = await Invitation.findByIdAndUpdate(inviteId, {
            requestStatus: 'friend',
        }, {
            new: true,
            runValidators: true,
        })

        // invite sender
        if (!invite) throw createError(404, 'Invitation not-found');


        return successResponse(res, {
            statusCode: 200,
            message: 'Invitation accepted',
            payload: {
                invite,
            }
        })
    } catch (error) {
        if (error instanceof mongoose.Error) {
            return next(createError(400, "Invalid user ID"))
        }
        next(error);
    }
}

// Delete invitaion
const deleteInvitation = async (req, res, next) => {
    try {
        const inviteId = req?.params?.id;

        // invitation 
        const invite = await Invitation.findByIdAndDelete(inviteId)

        // invite sender
        if (!invite) throw createError(404, 'Invitaion not-found');


        return successResponse(res, {
            statusCode: 200,
            message: 'Invitation accepted',
            payload: {
                invite,
            }
        })
    } catch (error) {
        if (error instanceof mongoose.Error) {
            return next(createError(400, "Invalid user ID"))
        }
        next(error);
    }
}

module.exports = {
    sendNewInvitation,
    invitationAccepted,
    deleteInvitation,
    getAllInvitations,
}