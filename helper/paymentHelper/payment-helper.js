const Razorpay = require('razorpay');
require('dotenv').config()

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET ,
});

module.exports = {
    generateRazorpay: (order, total) => {
        console.log(order,total,'orderrrrrrrrrr nad totallllllllll');
        return new Promise(async(resolve, reject) => {
            const receiptId = order._id;
            const totalPrice = Math.round(total * 100);
            console.log(receiptId ,'receiptidddddddddd');
            console.log(totalPrice),'totalpriceeeeeeee';
            var options = {
                amount: totalPrice,
                currency: "INR",
                receipt: "" + receiptId
            };
        instance.orders.create(options, function(err, order){
            resolve(order)
            })
            // resolve({status: true, totalPrice: totalPrice, receiptId: receiptId, order: order})
        })
        
    }
}