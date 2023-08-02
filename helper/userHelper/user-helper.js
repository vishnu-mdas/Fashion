const User = require("../../models/user");
const Cart = require("../../models/cart");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Order = require("../../models/order");
const Coupon = require("../../models/coupon");
const Address = require("../../models/address");
const bcrypt = require("bcrypt");
const { response } = require("express");

module.exports = {
  doSignup: (userData) => {
    console.log(userData);
    return new Promise(async (resolve, reject) => {
      try {
        let userdata = await User.findOne({ userEmail: userData.email });

        console.log("///////////////");
        if (userdata) {
          resolve({ status: false, message: "Email already exists", user: userdata });
        } else {
          userData.password = await bcrypt.hash(userData.password, 10);
          let UserData = new User({
            userName: userData.username,
            userMobile:userData.mobilenumber,
            userEmail: userData.email,
            userPassword: userData.password,
            isBlocked: false,
          });
          await UserData.save().catch((error) => {
            console.log(error.message);
          });
          resolve({ status: true, user: UserData });
        }
      } catch (error) {
        console.log(error.message);
        reject(error);
      }
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let loginData = await User.findOne({ userEmail: userData.email });
        console.log(userData);
        if (loginData) {
          if (loginData.isBlocked) {
            resolve({ status: false, message: "User Blocked" });
          } else {
            let result = await bcrypt.compare(userData.password, loginData.userPassword);
            if (!result) {
              resolve({ status: false, message: "Incorrect password. Please check your password and try again." });
              return;
            }
            resolve({ status: true, user: loginData });
          }
        } else {
          resolve({ status: false, message: "User not found. Please check your email and try again" });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
 
  // validateUser: (userData) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const mobile = await User.findOne({ userMobile: userData.mobilenumber });
  //       console.log(mobile,'mobileeeeeeeeeeeeeeeeeeeeenooooooo');
  //       if (mobile) {
  //         resolve(true);
  //       } else {
  //         resolve(false);
  //       }
  //     } catch (error) {
  //       console.log("Error in validating the user", error);
  //       reject(error);
  //     }
  //   });
  // },

  validateUser: (userData) => {
    console.log(userData,'userdataaaaaaaaaaaaaa');
    return new Promise((resolve, reject) => {
        User.findOne({ userMobile: userData.mobilenumber }).lean().then((result) => {
            resolve(result);
        }).catch((err) => {
            console.log('Error while validating mobile number: ' + err);
            reject(err);
        });
    });
},

updatePassword: (userData,mob) => {
  try {
      return new Promise(async (resolve, reject) => {
          const password = await bcrypt.hash(userData.newpassword, 10);
          User.updateOne({userMobile: mob}, {$set:{userPassword: password}}).then((response) => {
              console.log('User Password Updateddddddddd')    
              resolve(response);
          })
      })
  } catch (err) {
      console.log('Error while updating password: '+ err);
  }
},


  addAddress: async (userId, address) => {
    return new Promise(async (resolve, reject) => {
      try {

        Address.findOne({userId:userId}).then(async(userAddress)=>{ 
          if(userAddress){
            Address.updateOne({userId:userId},{$push:{address: {
              fname: address.fname,
              lname: address.lname,
              houseName: address.housename,
              villageName: address.villageName,
              city: address.city,
              district: address.district,
              pincode: address.pincode,
              state: address.state,
            }}}).then((response)=>{
              resolve(response);
            }).catch((err)=>{
              console.log('Error in addAddress Helper:::',err);
            })
          }else{
            const addressData = new Address({
          userId: userId,
          address: [
            {
              fname: address.fname,
              lname: address.lname,
              houseName: address.houseName,
              villageName: address.villageName,
              city: address.city,
              district: address.district,
              pincode: address.pincode,
              state: address.state,
            },
          ],
        });
          await addressData.save().catch((error) => {
          console.log(error.message);
        });
        resolve(addressData);
          }
        })
      } catch (err) {
        console.log('Error while adding Address: ' + err);
        reject(err);
      }
    });
  },

  findUserById: (id) => {
    try{
        return new Promise((resolve, reject) => {
            User.findOne({ userId: new ObjectId(id) }).lean().then((result) => {
                resolve(result);
            })
        })
    } catch(err){
        console.log('Error while fetching user by Id: '+ err);
    }
},

getAddress: (userId) => {
  try {
    return new Promise((resolve, reject) => {
      Address.findOne({ userId: userId }).lean().then((userAddress) => {
          resolve(userAddress);
        })
        .catch((err) => {
          console.log("Error (outside) in getting cart while checkout in helper", err);
          reject(err);
        });
    });
  } catch (err) {
    console.log("Error while getting address: " + err);
    throw err;
  }
},


  addToCart: (prodData, userId, quantity) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cartData = await Cart.findOne({ userid: new ObjectId(userId) });

        if (!cartData) {
          let newCart = new Cart({
            userid: userId,
            items: [{ productid: prodData, quantity: quantity }],
          });

          await newCart.save();

          resolve({ status: true, message: "Product added to cart" });
        } else {
          let result = await cartData.items.findIndex((item) => item.productid == prodData);

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
              { $push: { items: { productid: prodData, quantity: quantity } } }
            );
            resolve({ status: true, message: "Product added to cart" });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  getCartProducts: (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        Cart.findOne({ userid: user }).populate("items.productid").lean().then(async (userCart)=>{
          console.log(userCart, "userrrrrrrrr cartttttttttttttt");
          if (userCart) {
            const couponData = await Coupon.find({ Status: true });
            console.log(couponData, "couponData");
            if (couponData) {
              resolve({ status: true, userCart: userCart, couponData: couponData });
            } else {
              resolve({ status: true, userCart: userCart });
            }
          } else {
            resolve({ status: false });
          }
        })        
      } catch (error) {
        reject(error);
      }
    });
  },
  changeProQuantity: (data, userId) => {
    return new Promise((resolve, reject) => {
      let total = 0;
      data.count = parseInt(data.count);
      data.quantity = parseInt(data.quantity);
      console.log(data.count, data.quantity);
      let price = parseInt(data.productPrice);
      const prodId = data.product;

      if (data.count == -1 && data.quantity == 0) {
        Cart.updateOne(
          { userid: userId },
          {
            $pull: {
              items: {
                productid: prodId,
              },
            },
          }
        )
          .then((status) => {
            console.log(status);
            resolve({ removeProduct: true });
          })
          .catch((error) => {
            reject(error);
          });
      }
      Cart.updateOne(
        { userid: userId, "items.productid": prodId },
        { $inc: { "items.$.quantity": data.count } }
      )
        .then(() => {
          Cart.findOne({ userid: userId })
            .populate("items.productid")
            .then((cart) => {
              if (!cart) {
                resolve({ status: false, message: "Cart not found" });
              } else {
                for (let i = 0; i < cart.items.length; i++) {
                  if (cart.items[i].productid._id == prodId) {
                    const quantity = cart.items[i].quantity;
                    const subTotal = quantity * price;

                    if (data.count == 1) {
                      total = price;
                    } else {
                      total = -price;
                    }

                    resolve({
                      status: true,
                      quantity: quantity,
                      subTotal: subTotal,
                      total: total,
                    });
                    break;
                  }
                }
              }
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getCart: (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        let userCart = await Cart.findOne({ userid: user }).populate("items.productid").lean();
        
        if (userCart) {
          resolve(userCart);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  removefromCart: (prodId, user) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await Cart.findOne({ userid: user });

        if (!cart) {
          resolve({ status: false, message: "Cart not found" });
          return;
        }
        await Cart.updateOne(
          { userid: user },
          { $pull: { items: { productid: prodId } } }
        );

        const updatedCart = await Cart.findOne({ userid: user })
          .populate("items.productid")
          .lean();

        resolve({
          status: true,
          message: "Item removed from cart",
          updatedCart: updatedCart,
        });
      } catch (error) {
        reject({ status: false, message: error.message });
      }
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },
  addCartTotal: (total, user) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cart = await Cart.findOne({ userid: user });
        console.log(cart);

        if (!cart) {
          resolve({ status: false, message: "Cart not found" });
          return;
        }
        await Cart.updateOne({ userid: user }, { Total: total });
        resolve({ status: true });
      } catch (error) {
        reject(error);
      }
    });
  },
  getactivecoupon: (data) => {
    console.log(data,"3333333333333333333333333333");
    return new Promise(async (resolve, reject) => {
      try {
        const activeCoupon = await Coupon.findOne({
          couponCode: data.couponName,
        });
        let cartSubtotal = parseFloat(data.cartSubtotal);
        console.log(cartSubtotal, "cartSubtotal");
        if (!activeCoupon) {
          resolve({ status: false, message: "Invalid Coupon" });
        } else {
          if (activeCoupon.couponMinAmount <= cartSubtotal) {
            const discountedAmount = (
              cartSubtotal * activeCoupon.couponDiscount
            ).toFixed(2);
            cartSubtotal = cartSubtotal - discountedAmount;
            console.log(cartSubtotal, "4444444444444444444");

            resolve({
              status: true,
              cartSubtotal: cartSubtotal,
              discountedAmount: discountedAmount,
              message: "Coupon Applied Successfully",
            });
          } else {
            resolve({ status: false, message: "Cannot apply coupon" });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  orderPlace: (data, user) => {
    return new Promise(async (resolve, reject) => {
      try {
        let items = await Cart.findOne({ userid: user }).populate("items.productid");
        const total = items.Total;

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
              products: { products: items },
              totalAmount: total,
              shipping_status: "Order Placed",
              date: new Date(),
            });
            await order.save();

            await Cart.deleteOne({ userid: user });
            resolve({ status: true, paymentOption: data.payment_option });
          } else {
            // Handle other payment methods
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },
};
