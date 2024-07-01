const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secretEnv");
const isLogin = async (req, res, next) => {
    const token = req.cookies?.access_token;
    if (!token) {
        return res.status(401).send({
            success: false,
            message: 'Forbidden',
        })
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                success: false,
                message: err,
            })
        }

        req.user = decoded
        next();
    })
}

module.exports = isLogin