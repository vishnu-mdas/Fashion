const {response} = require("express")
 const {shopProducts}= require('../../helper/productHelper/product-helper')
 

module.exports = {
    viewProducts: (req, res) => {
      shopProducts.getAllProducts().then((response) => {
          let products = response;
          
          res.render("user/view_products",{products});
        }).catch((error=>{
          console.log(error.message);
        }))
      },

  productDetails:(req,res)=>{
    const user=req.session.user
    shopProducts(req.params.id).then(response => {
      const getProducts = response.getProduct ;
      
      res.render('user/productDetails',{products: getProducts,user})
    })
}
}