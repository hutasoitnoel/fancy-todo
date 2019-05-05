const route = require('express').Router()
const QuoteController = require('../controllers/QuoteController')

route.get('/', QuoteController.generateRandomQuote)

module.exports = route