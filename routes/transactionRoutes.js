const Router = require('express').Router()
const {transactionControllers} = require('./../controllers')

Router.post('/addtocart',transactionControllers.addToCart)

module.exports = Router