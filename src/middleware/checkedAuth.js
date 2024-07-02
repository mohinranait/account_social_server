
const checkAuth = async (req, res, next) => {
    const reqId = req.query.userId;
    const sessionId = req.user?.id;
    if (reqId !== sessionId) {
        return res.status(400).send({
            success: false,
            message: 'Forbidden checkAuth',
        })
    }
    next();

}

module.exports = checkAuth