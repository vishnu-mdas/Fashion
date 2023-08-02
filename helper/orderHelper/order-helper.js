const Cart = require('../../models/cart')
const Order = require('../../models/order');
const Product = require("../../models/products");
const { generateRazorpay} = require('../../helper/paymentHelper/payment-helper')
const crypto = require("crypto");

module.exports ={ 
    
    orderPlace: (data, user) => {
        return new Promise(async (resolve, reject) => {
          try {
            const items = await Cart.findOne({ userid: user }).populate('items.productid');
            console.log(items.items,"itsmesssss s ");
            const total = items.Total;
            console.log(total);
            if (!items) {
              resolve({ status: false, message: "Cart not found" });
            } else {
              if (data.payment_option === "COD") {
                let order = new Order({
                  user_id: user,
                  deliveryAddress: {
                    fname: data.fname,
                    lname: data.lname,
                    billing_address: data.billing_address,
                    state: data.state,
                    city: data.city,
                    zipcode: data.zipcode,
                    phone: data.phone,
                  },
                  paymentMethod: data.payment_option,
                  products: items.items,
                  totalAmount: total,
                  shipping_status: "Order Placed",
                  date: new Date(),
                });
                order.save();
                console.log(order," orderrrrrrrrrrrrrrrrr");
                await Cart.deleteOne({ userid: user });
                resolve({ status: true, paymentOption: data.payment_option });
              } else if (data.payment_option === "onlinepayment") {
                const paymentmethod = data.payment_option;
                let order = new Order({
                  user_id: user,
                  deliveryAddress: {
                    fname: data.fname,
                    lname: data.lname,
                    billing_address: data.billing_address,
                    state: data.state,
                    city: data.city,
                    zipcode: data.zipcode,
                    phone: data.phone,
                  },
                  paymentMethod: paymentmethod,
                  products: items.items,
                  totalAmount: total,
                  shipping_status: "Pending",
                  date: new Date(),
                });
                order.save();
                generateRazorpay(order, total).then((response) => {
                  resolve(response);
                });
              } else {
              }
            }
          } catch (error) {}
        });
} ,

verifypayment: (details) => {
  return new Promise(async (resolve, reject) => {
    console.log('inside helperrrrrrrrrrr');
    try{
      let hmac = crypto.createHmac("sha256", "UQD36ghXWjmwc234qsMxXL1u");
      hmac.update(
        details["response[razorpay_order_id]"] +
          "|" +
          details["response[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == details["response[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    }
    catch(err){
      console.log(err.message);
    }
     
  });
},

changePaymentStatus: (orderId, user) => {
  console.log(orderId,'req.bodyyyyyyyyyyyyyyyyy');
  return new Promise(async (resolve, reject) => {
    console.log('inside changePaymentStatusssssss');

    const changepaymentstatus = await Order.findOneAndUpdate(
      { _id: orderId },
      { shipping_status: "Order Placed" }
    );
    if (changepaymentstatus) {
      await Cart.deleteOne({ userid: user });
      resolve({ status: true });
    }
  });
},

viewOrderedList: () => {
  try{
    return new Promise ((resolve,reject)=>{
      Order.find().lean().then((orderList)=>{
        resolve(orderList)
      }).catch((err)=>{
        console.log(err);
      })
    })
  } catch (error){
    console.log('hhh', error);
  }

  },

  getOrderdetails: (orderId, userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        // Get the user's order
        const orderColl = await Order
          .findOne({  user_id: userId, "order._id": orderId }, { "order.$": 1 })
          .populate("order.items.product")
          .lean();

        console.log("its order collection", orderColl);
        const order = orderColl.order[0];

        console.log(order);

        if (!order) {
          throw new Error("Order not found");
        }

        // console.log('hello::', products);

        resolve(order);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },


cancelorder: (orderId) => {
  
  return new Promise(async (resolve, reject) => {
    console.log('inside helperrrrrrrrrrrrrrr',orderId);
    try {
      const cancelOrder = await Order.findOne({ _id: orderId });
      if (!cancelOrder) {
        resolve({ status: false, message: "Order not found" });
      } else {
        await Order.updateOne(
          { _id: orderId },
          { $set: { shipping_status: "Cancelled" } }
        );
        resolve({ status: true, message: "Order cancelled successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  });
},

viewOrderedProducts: (orderId) => {
  return new Promise(async(resolve, reject) => {
    try {
        const orderDetails = await Order.findOne({_id: orderId}).populate('products.productid');
        console.log(orderDetails,'orderDetailssssssssssssss');
        resolve(orderDetails)
      } catch (error) {
        console.log(error.message,"err messsage");
      }
})
},
lastOrdered: () => {
  return new Promise(async (resolve, reject) => {
    try {
      const lastOrder = await Order.findOne().sort({ date: -1 }).populate('products.productid').exec();

      // 'lastOrder' will contain the last order from the collection
      console.log(lastOrder,"Last Orderrrrrrrrrr");

      resolve(lastOrder); // Resolve the promise with the last order
    } catch (err) {
      console.error(err);
      reject(err); // Reject the promise with the error
    }
  });
}

}