const authRouter = require('express').Router();
const { createNewUser, loginUser, logoutUser, findAuthenticationUser, uploadMedia } = require('../controllers/AuthController');
const isLogin = require('../middleware/checkedLogin');
const Joi = require('joi');
const upload = require('../middleware/uploadFile');




authRouter.post('/create', createNewUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/auth', isLogin, findAuthenticationUser);
authRouter.post('/upload', upload.single('file'), uploadMedia);

module.exports = authRouter;