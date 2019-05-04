const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.token, process.env.SECRET)
        next()
    } catch (err) {
        res.status(500).json(err)
    }
}