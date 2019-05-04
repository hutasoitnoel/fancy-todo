const User = require('../models/User')
const Todo = require('../models/Todo')

module.exports = (req, res, next) => {
    Todo.findOne({_id: req.params.id})
        .then(todo => {
            if (todo.user == req.decoded._id) next()
            else res.status(401).json(`${req.decoded.name} is not authorized`)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}