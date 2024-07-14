
const isOwner = async (req, res, next) => {
    const reqId = req.query.userId; // userId is owner ID
    const sessionId = req.user?.id;
    if (reqId !== sessionId) {
        return res.status(400).send({
            success: false,
            message: 'Forbidden owner',
        })
    }
    next();

}

module.exports = isOwner