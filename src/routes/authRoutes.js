const authRouter = require('express').Router();
const { createNewUser } = require('../controllers/AuthController');



authRouter.post('/create', createNewUser);

module.exports = authRouter;