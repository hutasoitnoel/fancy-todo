const route = require('express').Router()
const UserController = require('../controllers/UserController')

route.post('/googleSignIn', UserController.googleSignIn)
route.post('/signIn', UserController.signIn)
route.post('/register', UserController.register)

module.exports = route