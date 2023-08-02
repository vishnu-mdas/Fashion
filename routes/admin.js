var express = require('express');
var router = express.Router();

const multer  = require('multer')
const upload = require('../config/multer')
const {dashboard,displayDashboard} = require('../controllers/admin/homeControllers')
const {adminSession,adminLogin,}= require('../middleware/session')
const {middleware}= require('../controllers/admin/homeControllers')
const {checkBlocked}= require('../middleware/session')
const {category,addCategory,editCategory,hideunhide,updatedCategory} = require('../controllers/admin/productControllers')
const {adminlogin,adminLoginData,adminLogout,productList,productAdd,submitProduct,getEditProduct,updateEditProduct,deleteProduct}= require('../controllers/admin/authControllers')
const {addBanner, listBanner, addBannerData, editBanner, updateBanner, deleteBanner} = require('../controllers/admin/bannerControllers')
const {addCoupons, showCoupons, addcoupon, editCoupon, updatedCoupon, deleteCoupon} = require('../controllers/admin/couponControllers')
const {salesReport} = require('../controllers/admin/salesControllers')
const {usersList,getOrders,vieworderedProduct,blockUser,unBlockUser}= require('../controllers/admin/userControllers');
// const category = require('../models/category');



/* GET home page. */

// router.get('/',salesgraph);
router.get('/login',adminLogin,adminlogin) 

router.post('/login',adminLoginData)
router.get('/logout',adminLogout)

router.get('/',adminSession,displayDashboard);
router.post('/updateDashboard', dashboard)
//product management
router.get('/product_list/',adminSession,productList)

router.get('/product_add',adminSession,productAdd)
router.post('/product_add',upload.array('productImages',4),submitProduct)

router.get('/product_edit/:id',adminSession,getEditProduct)

router.post('/product_edit',updateEditProduct)
router.get('/product_delete/:id',adminSession,deleteProduct)

//category management

router.get('/category',category)
router.post('/addCategory',addCategory)
router.get('/editCategory/:id',editCategory)
router.get('/category/hide/:id',hideunhide);
router.get('/editCategory/:id',updatedCategory)

//user management
router.get('/users',usersList)
router.post('/blockUser/:id',blockUser)
router.post('/unBlockUser/:id', unBlockUser)
router.get('/orders',getOrders)
router.get('/viewOrderedProduct/:id', vieworderedProduct)

//Banner Management
router.get('/addBanner', addBanner)
router.post('/addBanner',upload.array('bannerimages',4), addBannerData )
router.get('/listBanners',listBanner)
router.get('/editBanner/:id',editBanner);
router.post('/editBanner/:id',upload.array('bannerimages',4) ,updateBanner)
router.post('/deleteBanner/:id',deleteBanner);

// Coupons Management
router.get('/addCoupon',addcoupon)

router.post('/addCoupon',addCoupons)

router.get('/showCoupon',showCoupons)
router.get('/editCoupon/:id',editCoupon)
router.post('/editCoupon/:id', updatedCoupon)
router.post('/deleteCoupon/:id',deleteCoupon)

//sales report
router.get('/salesReport',salesReport)


module.exports = router;
