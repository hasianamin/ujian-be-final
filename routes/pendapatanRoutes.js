const Router = require('express').Router()
const {pendapatanControllers} = require('./../controllers')

Router.get('/income',pendapatanControllers.income)
Router.get('/incomepotential',pendapatanControllers.incomePotential)
Router.get('/bestseller',pendapatanControllers.bestSeller)
Router.get('/notseller',pendapatanControllers.notseller)
Router.get('/bestcategory',pendapatanControllers.bestCategory)
Router.get('/bestproduct',pendapatanControllers.bestProduct)

module.exports=Router