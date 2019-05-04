const route = require('express').Router()
const User = require('./user')
const Todo = require('./todo')

route.use('/user', User)
route.use('/todo', Todo)

module.exports = route