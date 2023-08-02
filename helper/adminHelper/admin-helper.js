const Admin = require("../../models/admin");
const product = require("../../models/products");
const User = require("../../models/user")
const bcrypt=require('bcrypt')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Order= require("../../models/order")
const category =require("../../models/category")

module.exports = {
   doLogin: (logindata) => {
    console.log(logindata);
    return new Promise(async (resolve, reject) => {
      Admin.findOne({ adminEmail: logindata.email }).then(
        async (response) => {
          console.log(response);
          if (response) {
            let result = await bcrypt.compare(
                logindata.password,
                response.adminPassword
            ).catch(error=>{
                console.log(error.message);
            })
            console.log(result);
            if (result) {
              resolve({ status: true });
            } else {
              resolve({ status: false, message: "Invalid password" });
            }
          } else {
            resolve({ status: false, message: "Invalid email or password" });
          }
        }
      );
    });
  },
  addProduct: (productData,files)=>{
    return new Promise(async(resolve,reject)=>{
        const {product_name,description,price,offer_price,category,in_stock}=productData
        const images= files.map((file)=>file.filename); 
        console.log(images);
        if(!product_name || !description || !price || !offer_price || !category || !in_stock){
            resolve({status:false})
            return
        }

        const products = new product({
            productTitle:product_name,
            description:description,
            offerPrice:offer_price,
            orginalPrice:price,
            category:category,
            stock:in_stock,
            image:images
        })
        await products.save()
        resolve({status:true})
    })
  },
  updateProduct: (productData)=>{
    return new Promise(async(resolve,reject)=>{
        const {product_name,description,price,offer_price,category,in_stock,proId}=productData
        if(!product_name || !description || !price || !offer_price || !category || !in_stock){
            resolve({status:false})
            return
        }

      product.updateOne({_id:new ObjectId(proId)},{
        $set:{
            productTitle:product_name,
            description:description,
            offerPrice:offer_price,
            orginalPrice:price,
            category:category,
            stock:in_stock
        }
      }).then(response=>{
         resolve({status:true})
      })   
    })
  },
   getProducts:()=>{
    return new Promise((resolve,reject)=>{
        product.find({deleteStatus:{$ne:true}}).then(response=>{
            console.log(response);
            resolve(response)
        })
    })
  },
  

  getCategory: () => {
    return new Promise(async (resolve, reject) => {
      let categories = await category.find();

      resolve(categories);
    });
  },
  getEditProduct:(proId)=>{
    return new Promise((resolve,reject)=>{
        product.find({_id:new ObjectId(proId)}).then(response=>{
            console.log(response);
            resolve(response)
        }).catch(error=>{
            console.log(error.message);
        })
    })
  },
  deleteProduct:(proId)=>{
    return new Promise((resolve,reject)=>{
        product.updateOne({_id:new ObjectId(proId)},{
            $set:{deleteStatus:true}
        }).then(response=>{
            console.log(response);
            resolve(response)
        }).catch(error=>{
            console.log(error.message);
        })
    })
  },
  salesReport: () => {
    return new Promise(async(resolve, reject) => {
        try{
            const salesreport = await Order.find();
        if(!salesreport){
            resolve({status: false, message: 'No datas found'})
        } else{
            resolve({status: true, salesreport: salesreport})
        }
        } catch(error){
            console.log(error);
        }
        })
},
    getAllUsers:()=>{
      try{
        return new Promise ((resolve,reject)=>{
          User.find().lean().then((user)=>{
            resolve(user)
            
          }).catch((err)=>{
            console.log(err);
          })
        })
      } catch (error){
        console.log('hhh', error);
      }
    },
    getAllOrders:()=> {
      try{
        return new Promise ((resolve,reject)=>{
          Order.find().lean().then((orderList) =>{
            resolve(orderList)
          }).catch((err)=>{
            console.log(err);
          })
        })
      } catch (error){
        console.log("Error", error);
      }
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


    blockuser: (userId) => {
      return new Promise(async(resolve, reject) =>{
          try{
              const users = await User.findByIdAndUpdate(userId,{isBlocked: true})
              const button = 'green';
              resolve({status: true, message: 'User blocked successfully', users: users, button: button  })
          }
          catch (error) {
              reject(error);
          }
      })
  },
  unBlockuser: (userId) => {
    return new Promise(async(resolve, reject) =>{
        try{
            const users = await User.findByIdAndUpdate({_id: userId},{isBlocked: false})
            const button = 'red';
            resolve({status: true, message: 'User Unblocked successfully', users: users, button: button })
        }
        catch (error) {
            reject(error);
        }
    })
}
};
