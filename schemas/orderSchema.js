const mongoose = require('mongoose'),
    reqString = { type: String, required: true },
    notreqString = { type: String, required: false },
    nonreqString = { type: String, required: false },

    reqNum = { type: Number, required: true }

const orderSchema = new mongoose.Schema({
    name: reqString,
    orderId: reqString,
    stripe_hidden: reqString,
    line1: reqString,
    line2: notreqString,
    line3: notreqString,
    payment_link: reqString,
    date: reqString,
    userId: reqString,
    status: {type: Boolean, default: false},
    cart: [{ name: nonreqString, quan: 0 }],
})

module.exports = mongoose.model("Order", orderSchema);