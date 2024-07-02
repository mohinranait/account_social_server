const User = require("../models/UserModal")

// get single user by ID
const getSingleUserById = async (req, res) => {
    try {

        const userId = req.params?.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.send({
                success: false,
                message: 'not-found',
            })
        }
        res.status(200).send({
            success: true,
            user,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).send({
            success: true,
            users,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getSingleUserById,
    getAllUsers,
}