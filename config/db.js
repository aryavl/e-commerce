const mongoose = require('mongoose')
// const Admin = require('../model/adminModel')
// const userUtilis = require('../utils/userUtils')
const db = mongoose.createConnection('mongodb://127.0.0.1:27017/ecommerce')




module.exports = db