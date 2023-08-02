
const { response } = require('express');
const userHelper = require('../../helper/userHelper/user-helper');
const Cart = require('../../models/cart');


     exports.usercart= (req,res)=>{
        console.log('inside cartcontollerrrrrrrrrr');
        const userId=req.session.user
        userHelper.getCartProducts(req.session.user).then((response)=>{
          if(response.status){
            const cartItems = response.userCart;
            const userId = req.session.user;
            const couponData = response.couponData;
            const isCartEmpty = cartItems.length === 0;
            console.log(isCartEmpty,'isCartEmptyyyyyyyyyyyyyyyyyyyyyy');
            console.log('res', response.userCart.items);
             res.render('user/cart',{ cartItems,userId,couponData,isCartEmpty })
          }else{
            // Render the cart page with the empty cart message
            res.render('user/cart', { cartItems: [], userId, couponData: [], isCartEmpty: true });
          }
        }).catch((error=>{
            console.log(error.message);
            res.render('error-page', { errorMessage: 'An error occurred while fetching the cart.' });
        }))
       
    }

    
    exports.addToCart= (req,res)=>{
      const user = req.session.user;

      // Check if the user is logged in
      if (!user) {
        // If the user is not logged in, redirect to the login page
        return res.redirect('/login'); // Adjust the URL to your login page URL
      }
    
        // const user=req.session.user
          userHelper.addToCart(req.params.id, user, req.body.quantity).then((response)=>{
         
         if(response.status){
            res.json({ message:" Product added to cart"})
         }

        })
        
    }

    // exports.viewCart= (req,res)=>{
    //     res.render('user/viewCart')
    // }

    exports.changequantity= (req,res)=>{
      console.log(req.body);
       
      const userId=req.session.user;

        userHelper.changeProQuantity(req.body,userId).then((response)=>{
          if(response){
            const quantity=response.quantity;
           
            const subTotal=response.subTotal;
            
            const total=response.total;
          
            res.json({ quantity: quantity, subTotal : subTotal, total: total, status:true });

          }else if(response.removeProduct){
            res.json(response)
          }else{
            res.json({message:'Error' });
          }
        })
    }
    exports.checkout = async (req, res) => {
      try {
        const response = await userHelper.getCart(req.session.user);
        const address = await userHelper.getAddress(req.session.user);
        console.log(response,address,'responseeeeeeeeeeee','addressssssssssssssssssssssssssssss');
        
        if (response) {
          const user = req.session.user;
          const items = response.items;
          const total = response.Total;
          res.render('user/checkout', { user, items, total,address });
        } else {
          console.log('No checkout');
        }
      } catch (error) {
        res.render('error', { error });
      }
    };
    

  exports.removeFromCart=(req,res) => {
    const prodId = req.params.id;
    const user = req.session.user;
    userHelper.removefromCart(prodId, user).then((response)=>{
        if(response.status){
            const status = response.status;
            const message = response.message;
            const updatedCart = response.updatedCart;
            res.json({status:status, message: message, updatedCart: updatedCart})
        }
        else{
            res.json({status:false, message: 'No actions Occured'})
        }
    })

  }

  exports.cartTotal=(req,res) =>{
    const total = parseInt(req.params.id);
    
    userHelper.addCartTotal(total, req.session.user).then(response => {
      try{
          if(response.status){
              res.json({status: true})
          }
          else{
              res.json({status: false})
          }
      }
      catch(error){
      }
  })
  }
  exports.orderConfirm=(req,res) =>{
    const user = req.session.user;
    
    userHelper.orderPlace(req.body, user).then(response => {
        if(req.body.payment_option === 'COD'){
          res.render('user/orderConfirmation')
        }
        else if(req.body.payment_option === 'onlinepayment'){
            
        } 
    })  
  }

  exports.getActiveCoupon=(req,res) => {
    console.log('222222222222222222');
    userHelper.getactivecoupon(req.body).then(response => {
        if(response.status){
          console.log('5555555555555555555555');
            res.json({status: response.status, cartSubtotal: response.cartSubtotal,
                 discountedAmount: response.discountedAmount, message: response.message })

        }
        else{
            res.json({message: response.message, status: response.status})
        }
    })
}

