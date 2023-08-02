const { response } = require("express");
const mongoose = require('mongoose')
const orderHelper= require('../../helper/orderHelper/order-helper')

module.exports={
      userOrders : (req,res) =>{
       res.render('user/account')
  } ,
  placeOrder: (req, res) => {
    const user = req.session.user;
    console.log(user,"11111111111");
    orderHelper.orderPlace(req.body, user).then(response => {
      console.log(response,'responseeeeeeeeeee test '); 
        if(req.body.payment_option === 'COD'){
          console.log('inside if 2122222222222');
            res.json({status: 'codSUCCESS'})
        }
        else if(req.body.payment_option === 'onlinepayment'){
            res.json(response)
        } 
    })
},

verifyPayment: (req, res) => {
  console.log('checking paymentttttt');
  const user = req.session.user;
  orderHelper.verifypayment(req.body).then(() => {
    console.log('before payment statusssssssss');
    orderHelper.changePaymentStatus(req.body['order[receipt]'], user).then((response) => { 
      res.json({ status: response.status });
    }).catch((err) => {
      console.log(err); // Log the full error object
      res.json({ status: false, errorMessage: "Error" });
    });
  }).catch((err) => {
    console.log(err); // Log the full error object
    res.json({ status: false, errorMessage: "Error" });
  });
},
orderPlaced: (req,res) => {
  console.log('inside Controller last ordered product');
  orderHelper.lastOrdered().then(lastOrder=> {
    const lastOrderArray=[lastOrder];
    console.log(lastOrderArray,'lasttttttttttttoooooorderrrrrrrrrrrrrrr');
    res.render('user/orderConfirmation',{lastOrder:lastOrderArray})
  })

  
},
orderedList: (req,res) => {
  orderHelper.viewOrderedList().then(orderList => {
    console.log(orderList,'order    Listtttttttttttttttt11111111111111');
    res.render('user/orderedList',{orderList})
  })
},

vieworderedProducts:(req, res) => {
  orderHelper.viewOrderedProducts(req.params.id).then(orderDetails => {
      res.render('user/viewOrderDetail', {orderDetails})
  })
},

orderDetails: (req, res) => {
  viewOrderedProducts(req.params.id).then(orderDetails => {
      res.render('user/viewOrderDetail', {orderDetails})
  })
},


cancelOrder: (req,res) => {
  console.log('inside controllerrrrrrrrrrrr cancel order');
  orderHelper.cancelorder(req.params.id).then(response=> {
    if(response.status){
        res.json({ status: true, message: response.message });
    } else{
        res.json({ status: false, message: response.message });
    }
}).catch(error => {
    // Error occurred during cancellation
    res.status(500).json({ message: 'Error cancelling order', error });
  });
}
}
