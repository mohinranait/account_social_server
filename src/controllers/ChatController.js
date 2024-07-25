const Conversation = require("../models/ConversationModal");
const Message = require("../models/MessageModal");


const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user?.id;

        let convercation = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        })

        if (!convercation) {
            await Conversation.create({
                participants: [senderId, reciverId]
            })
        }

        const newMessage = new Message({
            message,
            reciverId,
            senderId,

        })

        if (newMessage) {
            convercation.message.push(newMessage._id)
        }

        // await convercation.save();
        // await newMessage.save();

        await Promise.all([convercation.save(), newMessage.save()])

        res.send({
            succcess: true,
            data: newMessage,
        })
    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        })
    }
}

const getMessage = async (req, res) => {
    try {

        const { id: userToChatId } = req.params;
        const senderId = req.user?.id;


        const convercation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate('message')

        res.send({
            message: true,
            data: convercation?.message,
        })

    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        })
    }
}


module.exports = {
    sendMessage,
    getMessage,
}