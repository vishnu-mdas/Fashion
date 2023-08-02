const productHelper = require('../../helper/productHelper/product-helper')
const wishlist = require('../../models/wishlist') 

exports.wishlist= (req,res)=>{
        
    const userId=req.session.user

    productHelper.getWishlist(req.session.user).then((wishlist)=>{
        
         res.render('user/wishlist',{wishlist,userId})

    }).catch((error=>{
        console.log(error.message);
    }))
   }
   exports.addToWishlist= (req,res)=>{ 
        const user=req.session.user
        
        productHelper.addToWishlist(req.params.id, user).then((response)=>{
      if(response.status){
        res.json({ message: response.message})
     }
  })
    } 
    exports.AddToCart=(req,res)=>{
      const user=req.session.user
      if (!user) {
        // If the user is not logged in, redirect to the login page
        return res.redirect('/login'); // Adjust the URL to your login page URL
      }
      

        productHelper.AddToCart(req.params.id, user, req.body.quantity).then((response)=>{
         
         if(response.status){
            res.json({ message:" Product added to cart"})
         }

        })
    }
    exports.removeFromWishlist=(req,res)=>{
      
      const prodId = req.params.id;
    const user = req.session.user;

    productHelper.removefromWishlist(prodId, user).then((response)=>{
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