const route = require('express').Router()
const User = require('./user')
const Todo = require('./todo')
const Quote = require('./quote')

route.use('/user', User)
route.use('/todo', Todo)
route.use('/quote', Quote)

module.exports = route