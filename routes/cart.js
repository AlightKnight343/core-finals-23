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
    let finalProductArr = []
    req.user.cart.map( async (product_orig)=> {
        var productArr = productData.filter(d=>d["name"]==product_orig.name);
        productArr.forEach(product => {
            total += parseInt(product.price) * product_orig.quan
            let newprod = product
            newprod.quantity = product_orig.quan
            finalProductArr.push(newprod)
        });
    })
    res.render("store/cart", { user: req.user, cart: finalProductArr,total: total})

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
    var name = req.params.id;
    var cart = req.user.cart;
    var index = cart.findIndex(product => product.name === name);
    cart[index].quan = req.body.quantity;
    req.user.cart = cart;
    req.user.save();
    res.send({ success: true });
    
})


module.exports = router;