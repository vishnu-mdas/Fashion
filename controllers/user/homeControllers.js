const mongoose = require('mongoose')
const User = require('../../models/user')
const address = require('../../models/address')
const productHelper = require("../../helper/productHelper/product-helper");
const bannerHelper = require("../../helper/bannerHelper/banner-helper")
const userHelper = require("../../helper/userHelper/user-helper");
const { response } = require('express');


module.exports={
    userHome: (req,res)=> {
        bannerHelper.getActiveBanner().then(response => {
            if(response.status){
                const activeBanner = response.activeBanner;
        productHelper.getAllProducts().then((response)=>{
            
             res.render('index', {activeBanner: activeBanner, products: response}); 
        })
    }
    else{
        res.render('index');
    }
    })   
    },


    userProfile: (req,res)=> {
        res.render('user/userProfile')
    },
    addAddress: (req, res) => {
        const address = req.body;
        console.log("<=-----ADDRESS-----=>", address);
        userHelper.addAddress(req.session.user, address).then((response) => {
          console.log(response,"responssssseeeeeeeeeeein controller");
          const userAddress= response

          res.redirect("/userProfile",);
        });
      },

      getAnAddrress: (req, res, next) => {
        try {
          const addressId = req.body.addressId;
          const userId = req.session.user;
          let address;
          userHelper.getAddress(userId).then((response) => {
            let addressList = response.address;
            console.log(addressList);
            for (let i = 0; i < addressList.length; i++) {
              if (addressList[i]._id == addressId) {
                address = addressList[i];
                break;
              }
            }
            console.log("single adddress::", address);
            res.status(200).json(address);
          });
        } catch (err) {
          console.log("Error getting single address ::", err);
        }
      },
      
      userProfile:(req,res)=>{
       res.render('user/userProfile')
      },

      getProfile: async (req, res) => {
        console.log('inside controllerrrrrrrrrrrrrrrrrrrr');
        try {
          const userId = req.session.user;
          const user = await address.findOne({ userId: userId }).lean()
           console.log(userId, user, 'useridddddddddd', 'userrrrrrrrrrrrrrrrrrrr');
          if (user) {
            const uAddress = user;
            console.log(uAddress, 'addressssssssssss');
      
            res.render('user/userProfile', { uAddress });
          } else {
            // Handle the case where user data is not found
            res.render('user/userProfile', { uAddress: null });
          }
        } catch (err) {
          console.log('Error fetching address', err);
          // Send an error page or JSON response with an appropriate error message
          res.status(500).render('errorPage', { errorMessage: 'Error fetching user data' });
        }
      }
      


}
