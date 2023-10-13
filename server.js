require("dotenv").config()
const express = require('express')
const app = express()
const session = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const ejs = require('ejs');
const ejsLayouts = require('express-ejs-layouts');
const cors = require('cors');
const passportInit = require('./middleware/passport.js')
var server = require('http').createServer(app);
const flash = require('express-flash')

//file imports
const authRoutes = require('./routers/authRoute.js')

//middlewares
app.use(express.json({ limit: '50mb' }), express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.static('public'))
app.use(flash())
app.use(ejsLayouts)

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
}));

app.use(cookieParser(process.env.SESSION_SECRET));

passportInit(passport)
// initialize passport after this
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
const dbUri = process.env.MONGO_URI
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log("Connected to mongodb"))

//routing
app.use('/auth', authRoutes)

//listen
const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Connected on port ${PORT}`))
