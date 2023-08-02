const Product =require('../../models/products')
const Cart = require('../../models/cart')
const mongoose= require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const Wishlist = require('../../models/wishlist')
const category = require('../../models/category');
const { response } = require('express');

module.exports = {
    getAllProducts:()=>{
      try{
        return new Promise ((resolve,reject)=>{
          Product.find().lean().then((product)=>{
            resolve(product)
          }).catch((err)=>{
            console.log(err);
          })
        })
      } catch (error){
        console.log('hhh', error);
      }
      
    },
    shopProducts:(prodId)=>{
      return new Promise (async(resolve,reject)=>{
        const getProduct= await Product.findOne({_id:prodId})
        console.log(getProduct);
        resolve({getProduct:getProduct })
      })
    },
    getWishlist:(user) => {
        console.log(user);
        return new Promise((resolve, reject) => {
          try {
            Wishlist.findOne({ userId: user }).populate("items.prodId").lean().then((response) => {
                console.log(response,'responseeeeeeeeee');
                resolve(response);
              });
          } catch (error) {
            console.log(error.message);
            reject(error);
          }
        });
      },
      
      addToWishlist: (prodId, userId) => {
        return new Promise(async (resolve, reject) => {
          try {
            const wishList = await Wishlist.findOne({ userId: userId }).populate()
            console.log(wishList,'wishlistttttttttt');
            if (wishList) {
                const result = wishList.items.findIndex((item) => item.prodId == prodId);
              if (result !== -1) {
                resolve({ status: true, message: 'Product Already in the Wishlist' });
                return;
              }
              await Wishlist.updateOne(
                { userId: userId },{ $push: { items: {prodId: prodId }} }
              );
              resolve({ status: true, message: 'Item added to wishlist' });
            } else {
              const userWishList = new Wishlist({
                userId: userId,
                prodId: [prodId],
              });
              await userWishList.save();
              resolve({ status: true, message: 'Item added to wishlist' });
            }
          } catch (error) {
            console.error('Error:', error);
            reject(error);
          }
        });
      },
      AddToCart: (prodData, userId, quantity) => {
        return new Promise(async (resolve, reject) => {
          try {
            
            const cartData = await Cart.findOne({ userid: new ObjectId(userId) });
            console.log(cartData);
            if (!cartData) {
              let newCart = new Cart({
                userid: userId,
                items: [{ productid: prodData, quantity : quantity }],
              });
    
              await newCart.save();
              console.log(newCart);
              resolve({ status: true, message: "Product added to cart" });
            } else {
              let result = await cartData.items.findIndex(
                (item) => item.productid == prodData
              );
    
              console.log(result);
              if (result !== -1) {
                await Cart.updateOne(
                  { userid: userId, "items.productid": prodData },
                  { $inc: { "items.$.quantity": quantity } }
                );
                resolve({ status: true, message: "Product added to cart" });
              } else {
                await Cart.updateOne(
                  { userid: userId },
                  { $push: { items: { productid: prodData, quantity: 1 } } }
                );
              }
    
              resolve({ status: true, message: "Product added to cart" });
            }
          } catch (error) {
            reject(error);
          }
        });
      },
      removefromWishlist:(prodId, user) => {
        return new Promise(async (resolve, reject) => {
          try {
            const wishlist = await Wishlist.findOne({ userId: user });//.populate('items.prodId').lean();
            console.log(wishlist);
            
            if (!wishlist) {
              resolve({ status: false, message: 'Cart not found' });
              return;
            }
            await Wishlist.updateOne(
              { userId: user },
              { $pull: { items: { prodId: prodId } } }
            );
      
            const updatedWlist = await Wishlist.findOne({userId:user}).populate('items.prodId').lean();
            console.log(updatedWlist);
            resolve({ status: true, message: 'Item removed from Wishlist', updatedWlist: updatedWlist });
          } catch (error) {
            reject({ status: false, message: error.message });
          }
        })
        .catch(error => {
          // Handle any unhandled promise rejections here
          console.error(error);
          throw error;
        });
      },
  



      
      
      // addCategory: (data) => {
      //   console.log(data.categoryname,'dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      //   return new Promise(async (resolve, reject) => {
      //     const { categoryname } = data;
      //     console.log(categoryname,'categorynameeeeeeeeeeeeeeeeeeee')
      //     const checkDuplicate = await category.find({categoryName: categoryname})
      //     console.log(checkDuplicate,'checkDuplicateeeeeeeeeeeeeee');
      //     if(!checkDuplicate[0]){
      //       console.log('ifffffffffffffffffffffffffff');
      //       const categoryData = new category({
      //         categoryName: categoryname
      //       });
      //       categoryData.save();
      //       resolve({ categoryData, status: true });
      //     } else{
      //       console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeee');
      //       resolve({status: false, message: 'Name already exists,Provide a Unique Name'})
      //     }
          
      //   });
      // },
      getCategory: () => {
        return new Promise(async (resolve, reject) => {
          const categoryObj = await category.find();
    
          resolve(categoryObj);
        });
      },
        hideunhidecat: async (id) => {
        try {  
            const categories = await category.findOne({ _id: id });
        console.log(categories,'categoriesssssssssssss');
            if (categories.hiddenstatus) {
              await category.updateOne({ _id: id }, { $set: { hiddenstatus: false } });
              return false;
            } else {
              await category.updateOne({ _id: id }, { $set: { hiddenstatus: true } });
              return true;
            }
          } catch (err) {
            console.log(err.message);
            throw err;
          }
        },
      geteditCategory: (id) => {
        return new Promise(async (resolve,reject) => {
        category.find({_id:id}).then(response => {
          resolve(response)
        }).catch(error=>{
          console.log(error.message);
        })
        })
      },
      updatedCategory:(data,body) => {
        return new Promise(async (resolve,reject) => {
          try{
            const updatedCategory = await category.findOneAndUpdate({},
              {
                categoryName:body.categoryName
            })
            resolve({status})
          }catch(error){
            reject(error)
          }
        })
      }

}

  
  