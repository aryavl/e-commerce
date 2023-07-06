const express=require('express')
const user_route= express()
// middleware for session handling
const userAuth = require('../middleware/userMiddleware')
const userController= require('../controller/userController')
user_route.set("view engine", "ejs")
user_route.set("views", "./views/user")


// login page
user_route.get('/',userAuth.isLogin,userController.getLogin)
user_route.get('/login',userAuth.isLogin,userController.getLogin)

user_route.post('/',userAuth.isLogin,userController.postLogin)
user_route.post('/login',userAuth.isLogin,userController.postLogin)
// signup

user_route.get('/signup',userAuth.isLogin,userController.getSignup)
user_route.post('/signup',userAuth.isLogin,userController.postSignup)

// otp page
user_route.get('/otpLogin',userAuth.isLogin,userController.getOtp)
user_route.post('/otpLogin',userAuth.otpVerify,userController.postOtp)
 user_route.get('/otpVerify',userAuth.isLogin,userController.getOtpVerify)
 user_route.post('/otpVerify',userAuth.otpValidate,userController.postOtpVerify)

// forgot
user_route.get('/forgot',userController.getForgot)
user_route.post('/forgot',userController.postForgot)
user_route.get('/resetPassword',userController.getResetPassword)
user_route.post('/resetPassword',userController.postResetPassword)
// user home
user_route.get('/home',userAuth.isLoggedIn,userController.getUserHome)

module.exports = user_route
