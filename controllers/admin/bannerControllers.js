const {
    addbanner,
    getBanner,
    editbanner,
    updatebanner,
    deletebanner
  } = require("../../helper/bannerHelper/banner-helper");
  
  
  module.exports = {
    addBanner: (req, res) => {
      try{
        res.render("admin/addBanner");
      } catch(err){
        console.log(err.message);
      }
      
    },
  
    addBannerData: (req, res) => {
      console.log('inside controllerrrrrrrrr');
      try{
        addbanner(req.body, req.files).then((response) => {
          res.redirect("/admin/listBanners");
        });
      } catch(err){
        console.log(err.message);
      }
      
    },
  
    listBanner: (req, res) => {
      try{
        const itemsPerPage = 9;
      const currentPage = parseInt(req.query.page) || 1;
      getBanner(itemsPerPage, currentPage).then((response) => {
        res.render('admin/listBanners',{currentPage: response.currentPage, getbanner: response.banners, totalPages: response.totalPages})
      });
      } catch(err){
        console.log(err.message);
      }
    },
  
    editBanner: (req, res) => {
      try{
        editbanner(req.params.id).then((response) => {
          if (response.status) {
            if (response.editBanner.Status) {
              
              const isActive = "enable";
              const editBanner = response.editBanner;
              res.render("admin/editBanner", {editBanner: editBanner,isActive: isActive,
              });
            } else {
            
              const isActive = "disable";
              const editBanner = response.editBanner;
              res.render("admin/editBanner", {editBanner: editBanner, isActive: isActive,
              });
            }
          } else {
            res.render("/listBanners", { message: response.message });
          }
        });
      } catch(err){
        console.log(err.message);
      }
    },
  
    updateBanner: (req, res) => {
      try{
        updatebanner(req.params.id, req.body, req.files).then((response) => {
          if(response.status){
              // req.flash('success', 'Banner updated successfully.');
              res.redirect('/admin/listBanners')
          } else{
              // req.flash('error', 'Banner not available.');
              res.redirect('/admin/listBanners')
          }
      });
      }catch(err){
        console.log(err.message);
      }
    },
  
    deleteBanner: (req, res) => {
      console.log('inside controllersssssssss delete banner');
      try{
        deletebanner(req.params.id).then(response => {
          if(response.status){
            const message = response.message;
            res.json({status: response.status, message: message, updatedBanner: response.updatedBanner});
          } else{
            const message = response.message;
            res.json({status: response.status, message: message});
          }
        })
      } catch(err){
        console.log(err.message);
      }
    }
    
  };