const mongoose = require('mongoose')
const db = require('../config/db.js')

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    is_valid:{
        type:Boolean,
        default:true
    }
})
const Admin = db.model('Admin',adminSchema)
module.exports = Admin