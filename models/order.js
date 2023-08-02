const mongoose = require('mongoose');
const Products = require('../models/products')

const orderSchema = new mongoose.Schema({
  
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'},
    deliveryAddress: Array,
    paymentMethod: String,
    products:[{
        productid : {
          type: mongoose.Schema.Types.ObjectId,
          ref: Products,
        },
        quantity: Number
        }],
    totalAmount: Number,
    payment_details: Object,
    shipping_status: String,
    date: Date
 
 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order