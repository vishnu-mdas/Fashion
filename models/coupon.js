const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    
  },
 
  couponDiscount: {
    type: Number,
    
  },

  couponMinAmount: {
    type: Number,
    
  },

  expireDate: {
    type: Date,
    
  },

  Status: { 
    type: Boolean,
    
  }
});

const coupon = mongoose.model('coupon', couponSchema);

module.exports = coupon