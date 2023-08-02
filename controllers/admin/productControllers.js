const productHelper = require('../../helper/productHelper/product-helper')
const categoryHelper = require('../../helper/categoryHelper/category-helper')

module.exports={
    category: (req, res) => {
        productHelper.getCategory().then((response) => {
          const categories = response;
          console.log(categories,'categoriesssssssssssssssssssssss');
          res.render("admin/category", { categories, admin:true, catext:false });
        });
      },

      addCategory: async (req, res, next) => {
        let categoryData = req.body;
        
        try {
          console.log("Category Name :" + categoryData.name);
          const existingCategory = await categoryHelper.getCategoryByName(categoryData.name);
          console.log("C--=-=-=-=- :" +existingCategory);
    
          if (existingCategory) {
            let cate = categoryData.name;
            console.log("Category already exists");
            await categoryHelper.allCategory().then((categories) => {
              res.render("admin/category", {categories,admin: true,catext:true,cate});
            });
          } else {
            await categoryHelper.addCategory(categoryData.name);
            console.log("Category added successfully");
            res.redirect("/admin/category");
          }
        } catch (err) {
          console.log("Error while adding category: " + err);
        }
      },









      //     addCategory: (req, res) => {
      //   console.log('inside addcategoryyyyyyyyyyyyyyyyy',req.body);
      //  productHelper.addCategory(req.body).then((response) => {
      //     if (response.status) {
      //       res.redirect("/admin/category");
      //     } else{
      //       res.render('admin/category',{categories: [],errorMessage: response.message})
      //     }
      //   });
      // },

      hideunhide: (req, res) => {
        try {
            let id = req.params.id;
            productHelper.hideunhidecat(id).then((result) => {
                res.redirect('/admin/category');
                if (result) {
                console.log('CATEGORY HIDDEN '+ req.params.id);
              }else {
                  console.log('CATEGORY UNHIDDEN '+ req.params.id);
                }
            });
        } catch (err) {
            console.log(err.message);
        }
    },

      editCategory: (req,res) => {
        let id= req.params.id;
        productHelper.geteditCategory(id).then((response) => {
          const categories= response
          res.render('admin/editCategory',{categories})
        });

      },
      updatedCategory:(req,res) => {
              updatedCategory(req.params.id, req.body).then (response => {
                res.render('/admin/category')
              })
      }
}

