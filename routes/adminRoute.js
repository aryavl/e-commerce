const express = require('express')
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminMiddleware')
const admin_route = express()

admin_route.set("view engine", "ejs")
admin_route.set("views", "./views/admin")

// admin login
admin_route.get('/',adminAuth.isAdminLoggIn,adminController.getAdminLoginPage)


module.exports = admin_route