const express = require('express')
const session = require('express-session')
const path = require('path')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
app.use(session({
  secret: "uuidv4",
  resave: false,
  saveUninitialized: true
}))
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});




app.use(express.static(path.join(__dirname, 'public')));

app.use('/',userRoute)
// app.use('/admin',adminRoute)


app.listen(3002)