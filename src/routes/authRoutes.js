const authRouter = require('express').Router();
const { createNewUser, loginUser, logoutUser, findAuthenticationUser } = require('../controllers/AuthController');
const isLogin = require('../middleware/checkedLogin');
const Joi = require('joi');




authRouter.post('/create', createNewUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/auth', isLogin, findAuthenticationUser);

module.exports = authRouter;