const User = require("../models/UserModal");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/secretEnv");
const { isoStringDateFormat } = require("../helpers/dateFormater");
const { successResponse } = require("../helpers/responsHandler");
const createError = require("http-errors")

// Register new user
const createNewUser = async (req, res, next) => {
    try {
        const { password, email, day, month, year, gender, firstName, lastName } = req.body;

        // validation field
        if (!firstName) throw createError(400, 'First name is required');
        if (!lastName) throw createError(400, 'Last name is required');
        if (!email) throw createError(400, 'Email is required')
        if (!day) throw createError(400, 'Day is required')
        if (!month) throw createError(400, 'Month is required')
        if (!year) throw createError(400, 'year is required')
        if (!password) throw createError(400, 'Password is required')



        // find exists user by email 
        const existsUser = await User.findOne({ email }).select('email _id')
        if (existsUser?._id) throw createError(409, 'Email already exists')




        // generate hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);


        // create user object
        const userObj = {
            name: {
                firstName,
                lastName,
                fullName: firstName + " " + lastName,
            },
            email,
            password: hashPassword,
            gender,
            birthday: {
                day,
                month,
                year,
                date: isoStringDateFormat(`${day} ${month} ${year}`)
            }
        };

        // Create new user query
        let user = await User.create(userObj);

        // convert to plain object and remove property
        user = user.toObject();
        delete user.password;

        // send success response 
        return successResponse(res, {
            message: "User create",
            statusCode: 201,
            payload: user,
        })
    } catch (error) {
        next(error)
    }
}

// login user
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) throw createError(400, 'Email is required')
        if (!password) throw createError(400, 'Password is required');

        // find existing user
        let existsUser = await User.findOne({ email });
        if (!existsUser) throw createError(404, "not-found");

        // match password
        const passMatch = await bcrypt.compare(password, existsUser?.password);
        if (!passMatch) throw createError(401, 'Forbidden');

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
        next(error)
    }
}


// logout user
const logoutUser = async (req, res, next) => {
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
        next(error)
    }
}


// Get authentication user
const findAuthenticationUser = async (req, res, next) => {
    try {
        const { id, role, email, } = req?.user;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(createError(404, 'not-found'))
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'login',
            payload: {
                user,
                isAuthenticated: true,
            }
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    createNewUser,
    loginUser,
    logoutUser,
    findAuthenticationUser,
}