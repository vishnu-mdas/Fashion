const express = require('express');
const  router = express.Router();
const userHelper=require('../helper/userHelper/user-helper')
const {userHome}= require('../controllers/user/homeControllers')
const {addAddress,getProfile,userProfile,getAnAddrress} = require ('../controllers/user/homeControllers')
const {userLogin,sendOtp,otpauthentication,otpverification} = require('../controllers/user/authControllers')
const {loginCheck, check} = require('../middleware/loginCheck')
const {userSignup} = require('../controllers/user/authControllers')
const {signupData}=require('../controllers/user/authControllers')
const {loginData,middleware,logOut,forgotPassword,enterOtp,checkUser,resetPassword,updatePassword}=require('../controllers/user/authControllers')
const {userLoginSession}= require('../middleware/session');
const {checkBlocked} = require('../middleware/session')
const {usercart, orderConfirm, getActiveCoupon} = require('../controllers/user/cartControllers')
const {wishlist,addToWishlist,AddToCart,removeFromWishlist} =require('../controllers/user/wishlistControllers')
const {addToCart,removeFromCart,cartTotal}= require('../controllers/user/cartControllers')
const {viewCart,changequantity,checkout} = require('../controllers/user/cartControllers')
const {viewProducts,productDetails} = require('../controllers/user/productControllers')
const {userOrders,placeOrder,orderPlaced,verifyPayment,vieworderedProducts,orderedList,cancelOrder,orderDetails} = require('../controllers/user/orderControllers')
const {headCartCount, headWishlistCount} = require('../controllers/user/userHeaderControllers')



/* GET users listing. */
router.use(middleware)
router.get('/',userHome);
//authorization//
router.get('/login',userLoginSession,userLogin);

// router.post('/sendOtp',sendOtp)

router.get('/signup',userLoginSession,userSignup);

router.post('/signup',signupData);

router.post('/login',loginData);

// OTP
router.get('/forgotpassword',forgotPassword);
// router.post('/enterotp',enterOtp);
router.post('/checkuser',checkUser);

router.get('/otppage',otpverification)

router.post('/verifyotp',otpauthentication)

router.get('/resetpassword',resetPassword)

router.post('/updatepassword',updatePassword)

router.get('/logout',logOut);

// user account

router.get('/userProfile',check,getProfile)
router.post('/addAddress',addAddress)
router.post('/getAnAddress',getAnAddrress)



  // Product related//

router.get('/view_products',userLoginSession,viewProducts)

router.get('/productDetails/:id',productDetails)


router.get('/headerCartCount/:id', headCartCount);


//coupon

router.post('/couponData',getActiveCoupon)

//wishlist
router.get('/wishlist',check,wishlist);
router.get('/userProfile',check,getProfile)
router.post('/addToWishlist/:id',check,addToWishlist)

router.post('/AddToCart/:id',AddToCart)
router.post('/removeFromWishlist/:id',removeFromWishlist)
    
//cart //
router.get('/cart',check, usercart);
router.post('/addtoCart/:id',check,addToCart)
router.post('/removeFromCart/:id',removeFromCart)

router.post('/changeQuantity',changequantity)
router.post('/cartTotal/:id',cartTotal)



 //order related//
router.get('/checkout',check,checkout)
router.post('/orderConfirmation',orderConfirm)
router.get('/orders',check,userOrders)
router.post('/placeOrder',placeOrder )
router.get('/viewOrderedProducts/:id', vieworderedProducts)
router.get('/orderedList',check,orderedList)
router.get('/orderdetails/:id',orderDetails)

// order success page
router.get('/orderConfirmation',orderPlaced)
router.post('/cancelOrder/:id',cancelOrder)


router.post('/verifypayment', verifyPayment)

module.exports = router;
