require("dotenv").config()
const express = require('express')
const app = express()
const session = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const ejs  = require('ejs');
const ejsLayouts = require('express-ejs-layouts');
const cors = require('cors');
const passportInit = require('./middleware/passport.js')
var server = require('http').createServer(app);
const flash = require('express-flash')

//file imports
const authRoutes = require('./routes/authRoute.js')
const cart = require('./routes/cart.js')

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
app.use('/cart', cart)

app.get('/', (req, res) => {
    res.render('index') // temporary. move to a router later
})

app.get('/gramophone', (req, res) => {
    res.render('gramophone.ejs') // temporary. move to a router later
})

app.get('/headphones', (req, res) => {
    res.render('headphones.ejs') // temporary. move to a router later
})


app.get('/watch', (req, res) => {
    res.render('watch.ejs') // temporary. move to a router later
})


app.get('/keyboard', (req, res) => {
    res.render('keyboard.ejs') // temporary. move to a router later
})


app.post('/addcart/:id', async (req, res) => {
    const user = req.user
    const name = req.params.id
    const productData = require('./products.json')
    if(!user) res.send({success: false})
    else{
        let cart = req.user.cart
        let newCart = []
        let flag = false
        cart.forEach((product) => {
            if(product.name == name){
                newCart.push({name: product.name, quan:product.quan+1})
                flag = true
            }else{
                newCart.push({name:product.name, quan:product.quan})
            }
        });

        if(!flag){
            newCart.push({name: name, quan: 1})
        }
        console.log(cart)
        req.user.cart = newCart
        req.user.save()
        res.send({ success: true });
    }
})


//listen
const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Connected on port ${PORT}`))
