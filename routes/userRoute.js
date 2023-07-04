const express=require('express')
const user_route= express()
// middleware for session handling
const userAuth = require('../middleware/userMiddleware')

user_route.set("view engine", "ejs")
user_route.set("views", "./views/user")


// login page
user_route.get('/',(req,res)=>{
    res.render('signup')
})

module.exports = user_route