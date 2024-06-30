const User = require("../models/UserModal");

// Register new user
const createNewUser = async (req, res) => {
    try {
        const body = req.body;
        const user = await User.create(body);
        res.status(201).send({
            success: true,
            message: "Success",
            user,
        })
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    createNewUser,
}