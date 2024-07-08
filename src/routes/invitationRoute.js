const { sendNewInvitation, invitationAccepted, deleteInvitation, getAllInvitations } = require('../controllers/InvitationController');
const checkAuth = require('../middleware/checkedAuth');
const isLogin = require('../middleware/checkedLogin');

const inviteRoute = require('express').Router();

inviteRoute.post('/send', isLogin, sendNewInvitation)
inviteRoute.get('/all', isLogin, getAllInvitations)
inviteRoute.patch('/accepted/:id', isLogin, invitationAccepted)
inviteRoute.delete('/delete/:id', isLogin, deleteInvitation)

module.exports = inviteRoute;