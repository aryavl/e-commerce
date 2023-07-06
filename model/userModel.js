const mongoose = require('mongoose')
const db = require('../config/db.js')

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    password:String,
    resetToken:String,
    otp:Number
})

const User = db.model('User',userSchema)
module.exports = User