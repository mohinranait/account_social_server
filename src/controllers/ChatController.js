const Conversation = require("../models/ConversationModal");
const Message = require("../models/MessageModal");




// send new Message 
const sendMessage = async (req, res) => {
    try {
        const body = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user?.id;

        let convercation = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        }).populate("creatorId").populate('otherId')

        if (!convercation) {
            convercation = await Conversation.create({
                participants: [senderId, reciverId],
                creatorId: senderId,
                otherId: reciverId
            })


        }

        const newMessage = new Message({
            message: body.message,
            reciverId,
            senderId,
        })

        if (newMessage) {
            convercation.messages.push(newMessage._id)
        }



        // await convercation.save();
        // await newMessage.save();

        await Promise.all([convercation.save(), newMessage.save()])




        res.send({
            success: true,
            convercation,
            message: newMessage,
        })
    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        })
    }
}

// get all messages by Convenstion
const getMessage = async (req, res) => {
    try {

        const { id: userToChatId } = req.params;
        const senderId = req.user?.id;


        const convercation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate('messages')


        res.send({
            message: true,
            messages: convercation?.messages,
        })

    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        })
    }
}


// get all convensions
const getAllConvenstions = async (req, res, next) => {
    try {
        const senderId = req.user?.id;
        let query = {
            participants: { $in: senderId }
        };

        const conversations = await Conversation.find(query).populate('messages').populate({
            path: 'creatorId',
            select: 'name.fullName name.firstName profileImage profileUrl'
        }).populate({
            path: 'otherId',
            select: 'name.fullName name.firstName profileImage profileUrl'
        })

        console.log("get con: ", conversations);

        res.send({
            success: true,
            conversations,
        })
    } catch (error) {

    }
}


module.exports = {
    sendMessage,
    getMessage,
    getAllConvenstions,
}