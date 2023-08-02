
const adminHelper = require("../../helper/adminHelper/admin-helper");

module.exports = {
  adminlogin: (req, res) => {
    res.render("admin/login");
  },
  adminLoginData: (req, res) => {
    console.log(req.body);
    adminHelper.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.adminLogin=true
        res.redirect("/admin");
      } else {
        res.redirect("/admin/login");
      }
    });
  },
   adminLogout:(req,res)=>{
    req.session.adminLogin=false;
    res.redirect("/admin/login");
   },
  dashboard: (req, res) => {
    res.render("admin/dashboard");
  },
  productList: (req, res) => {
    adminHelper.getProducts().then((response) => {
      let products = response;
      res.render("admin/productList",{products});
    });
  },
  productAdd: (req, res) => {
    console.log("Inside helperrrrrrrr");
    try{
      adminHelper.getCategory().then((response) => {
        const categories = Array.from(response);
        console.log(categories,"categoriesssssssssssssss arrray or notttttt");
        res.render("admin/addProduct", { categories, admin:true });
      });
    } catch(error){
      console.log(error);
    }
  },
 
  submitProduct: (req, res) => {
    console.log(req.body, 'this is request.body********');
    console.log(req.files,'this is files++++++++');
    adminHelper.addProduct(req.body,req.files).then((response) => {
      if (response.status) {
        res.redirect("/admin/product_list");
      } else {
        res.redirect("/admin/product_add");
      }
    });
  },
  updateEditProduct: (req, res) => {
    console.log(req.body);
    adminHelper.updateProduct(req.body).then((response) => {
      if (response.status) {
        res.redirect("/admin/product_list");
      } else {
        res.redirect("/admin/product_edit");
      }
    });
  },
   getEditProduct: (req, res) => {
    const proId = req.params.id
    adminHelper.getEditProduct(proId).then((response) => {
      const product = response
      res.render('admin/editProduct',{product})
    });
  },
  deleteProduct: (req, res) => {
    const proId = req.params.id
    adminHelper.deleteProduct(proId).then((response) => {
      res.redirect('/admin/product_list')
    });
  },
};
