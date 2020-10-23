const Router = require('express').Router()
const {authControllers} = require('./../controllers')

Router.post('/register',authControllers.register)
Router.post('/sendotp',authControllers.sendOtp)
Router.post('/login',authControllers.login)
Router.post('/verified/:id', authControllers.verified)

module.exports = Router