const Order = require('../../models/order')
const Product =require('../../models/products')
const User = require('../../models/user')
const category=require('../../models/category')


module.exports = {
    //////// getSalesDetails //////////
    getSalesDetails: () => {
      return new Promise((resolve, reject) => {
        Order
          .aggregate([
            {
              $group: {
                _id: { $month: "$date" },
                totalAmount: { $sum: "$totalAmount" },
              },
            },
          ])
          .then((salesByMonth) => {
            resolve(salesByMonth);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  
    getYearlySalesDetails: () => {
      return new Promise((resolve, reject) => {
        Order
          .aggregate([
            {
              $group: {
                _id: { $year: "$date" },
                totalAmount: { $sum: "$totalAmount" },
              },
            },
          ])
          .then((salesByYear) => {
            
            resolve(salesByYear);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  
    adminAllOrders:()=>{
      return new Promise((resolve,reject)=>{
          Order.find().populate([{
              path:'user_id',
              select:'userName'
          },{
              path:'products.productid',
              select:'productTitle'
          }]).then((allOrders)=>{
              
              resolve(allOrders)
          }).catch((error)=>{
              reject(error)
          })
      })
  },
  
  getOrdersByDate:async()=>{
    try{
        const ordersByDate = await Order.aggregate([
            {
                $group:{
                    _id:{
                        month:{ $month:"$date"},
                        year:{ $year:"$date"}
                    },
                    count:{$sum:1}
                }
            }
        ]);
        
        return ordersByDate;
    }catch(error){
        throw new Error(error)
    }
  },
  
  getCategorySales:async()=>{
    console.log('inside cateory salesssss');
    try{
        const orders = await Order.find().populate('products.productid').lean().exec();
        console.log(orders[orders.length-1].products,'et cateorysalessssssssssssss');
        const categorySales = {}
        orders.forEach(order=>{

            order.products.forEach(product=>{

                const ProductCategory = product.productid.category
                console.log(ProductCategory,'product categoryyyyyyyyyy');
                if(ProductCategory){
                    if(ProductCategory in categorySales){
                        categorySales[ProductCategory] += 1;
                    }else{
                        categorySales[ProductCategory] = 1;
                    }
                }
            })
        })
        const allCategories = await category.find()
        const result = allCategories.map(category=>{
            const count = categorySales[category.categoryName] || 0
            return {name:category.categoryName,count}
        })
       
        return result;
    }catch(error){
        throw error
    }
  },
  
  fetchallProducts: () => {
    return new Promise((resolve, reject) => {
        Product.find().then((products) => {
            resolve(products)
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    })
  },
  
  getAllUsers:()=>{
    return new Promise((resolve,reject)=>{
        User.find().then((allUsers)=>{
            resolve(allUsers)
        }).catch((err)=>{
            console.log(err);
            reject(err)
        })
        
    })
  },
  };