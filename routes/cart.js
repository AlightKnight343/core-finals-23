const express = require('express'),
    router = express.Router(),
    { ensureAdminAuthenticated, ensureAuthenticated } = require('../middleware/authenticate.js');
const User = require("../schemas/userSchema");
const {nanoid} = require("nanoid")



router.get('/', ensureAuthenticated, async (req, res)=> {
    if (!req.user.cart.length > 0) {
        return res.render("store/cart", { user: req.user, cart: [], total: 0 });
    }
    var total = 0;
    const productData = require("../products.json")
    // console.log(req.user.cart)
    var products = await req.user.cart.map( async (product_orig)=> {
        var product = productData.filter(d=>d["name"]==product_orig.name);
        console.log(product, "PRODUCT")
        total += parseInt(product.price) * product_orig.quan
        return product;
    })
    Promise.all(products).then(function(results) {
        results = results[0]
        // console.log(results)
        res.render("store/cart", { user: req.user, cart: results,total: total})
    })

    // Promise.all(products).then(products => {
    //     console.log(products)
    // }).catch(err => {
    //     console.log(err)
    // })
})

router.post('/delete/:id', ensureAuthenticated, (req, res)=>{
    var name = req.params.id;
    var cart = req.user.cart;
    var index = cart.findIndex(product => product.name === name);
    cart.splice(index, 1);
    req.user.cart = cart;
    req.user.save();
    res.send({ success: true });
})

router.post('/quantity/:id', ensureAuthenticated, (req, res)=>{
    var id = req.params.id;
    var cart = req.user.cart;
    var index = cart.findIndex(product => product.prodid === id);
    cart[index].quan = req.body.quantity;
    req.user.cart = cart;
    req.user.save();
    res.send({ success: true });
})


module.exports = router;