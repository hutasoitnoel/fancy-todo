const route = require('express').Router()
const TodoController = require('../controllers/TodoController')
const Authentication = require('../middlewares/authentication')
const Authorization = require('../middlewares/authorization')

route.use(Authentication)

// CREATE
route.post('/', TodoController.create)

// READ
route.get('/', TodoController.findAll)

// UPDATE
route.put('/:id', Authorization, TodoController.update)

// DELETE
route.delete('/:id', Authorization, TodoController.delete)

module.exports = route