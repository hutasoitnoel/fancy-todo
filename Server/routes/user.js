const route = require('express').Router()
const UserController = require('../controllers/UserController')
const Authentication = require('../middlewares/authentication')
const Authorization = require('../middlewares/authorization')

route.post('/googleSignIn', UserController.googleSignIn)
route.post('/signIn', UserController.signIn)
route.post('/register', UserController.register)

// route.use(Authentication)

route.get('/:id', UserController.findOne)
route.get('/', UserController.findAll)

module.exports = route