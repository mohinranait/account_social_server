const User = require("../models/UserModal");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/secretEnv");

// Register new user
const createNewUser = async (req, res) => {
    try {
        const { password, email } = req.body;

        if (!password) {
            return res.send({
                success: false,
                message: 'Password is required',
            })
        }
        if (!email) {
            return res.send({
                success: false,
                message: 'Email is required',
            })
        }

        // exists user 
        const existsUser = await User.findOne({ email }).select('email _id')
        if (existsUser?._id) {
            return res.status(409).send({
                success: false,
                message: 'Email already exists',
            })
        }

        const body = req.body;

        // generate hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Create new user query
        let user = await User.create({ ...body, password: hash });

        // convert to plain object and remove property
        user = user.toObject();
        delete user.password;
        delete user.role

        // send status 
        res.status(201).send({
            success: true,
            message: "Success",
            user,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}

// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.send({
                success: false,
                message: 'Email is required',
            })
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Password is required',
            })
        }

        // find existing user
        let existsUser = await User.findOne({ email }).select('password email role _id');
        if (!existsUser) {
            return res.status(404).send({
                success: false,
                message: 'not-found',
            })
        }

        // match password
        const passMatch = await bcrypt.compare(password, existsUser?.password);
        if (!passMatch) {
            return res.status(401).send({
                success: false,
                message: 'Forbidden',
            })
        }

        // convert to plain object and remove password
        existsUser = existsUser.toObject();
        delete existsUser.password

        // create token
        const token = await jwt.sign(
            {
                id: existsUser?._id,
                role: existsUser?.role,
                email: existsUser?.email,

            }, jwtSecret, { expiresIn: '1d' });

        // send response 
        res.status(200)
            .cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                samesite: "none",
            })
            .send({
                success: true,
                message: 'success',
                user: existsUser,
                isAuthenticated: true,
                token
            })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}


// logout user
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('access_token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        }).send({
            success: true,
            message: "logout successfull",
            isAuthenticated: false,
            user: null,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}


// Get authentication user
const findAuthenticationUser = async (req, res) => {
    try {
        const { id, role, email, } = req?.user;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).send({
                message: 'not-found',
                success: false,
            })
        }
        res.send({
            user,
            isAuthenticated: true,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}


module.exports = {
    createNewUser,
    loginUser,
    logoutUser,
    findAuthenticationUser,
}