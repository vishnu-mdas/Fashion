const {addcoupons, showcoupons, editcoupon, updatecoupon, deletecoupon} = require('../../helper/couponHelper/coupon-helper')

module.exports = {
    // get addCoupon Page
    addcoupon: (req, res) => { 
       req.session.errorMessage = null;
       const errorMessage = req.session.errorMessage;
       res.render('admin/addCoupon',{errorMessage: errorMessage});
    },

    // post addCoupon Data
    addCoupons: (req, res) => {
        console.log("inside controller add couponsssssssssss");
        try{
            addcoupons(req.body).then(response => {
                if(response.status){
                    res.redirect('/admin/showCoupon')
                } else{
                    res.render('admin/addCoupon', {errorMessage: response.message})
                }
              })
        } catch(error){
            
        }
      
    },

    showCoupons:(req, res) => {
        const itemsPerPage = 9;
        const currentPage = parseInt(req.query.page) || 1;
        showcoupons(itemsPerPage, currentPage).then(response => {
            if(response.status){
                res.render('admin/showCoupon',{currentPage: response.currentPage, showcoupon: response.coupons, totalPages: response.totalPages})
            } else{
                console.log('some errors occured');
            }
        })
    },


    editCoupon: (req, res) => {
        try {
          editcoupon(req.params.id).then((response) => {
            if (response.status) {
              const isActive = response.editcoupon.Status === "enable" ? true : false;
              res.render("admin/editCoupon", {
                editcoupon: response.editcoupon,
                isActive: isActive,
              });
            } else {
              const isActive = false; // Since the response.status is not true, set isActive to false
              res.render("admin/someErrorPage", {
                message: response.message,
                isActive: isActive,
              });
            }
          });
        } catch (err) {
          console.log(err.message);
        }
      },
      






    // editCoupon: (req, res) => {
    //     editcoupon(req.params.id).then(response => {
    //         if(response.status){
    //             res.render('admin/editCoupon',{editcoupon: response.editcoupon})
    //         }
    //     })
    // },

    updatedCoupon: (req, res) => {
       try{

       
        updatecoupon(req.params.id, req.body).then(response => {
            console.log(response,'responseeeeeeeeeeeeeeeeeee');
            
            if(response.status){
                res.redirect('/admin/showCoupon')
            }
        })
    }catch(error){
        console.log(error.message,'error message');
    }
    },

    deleteCoupon: (req, res) => {
        deletecoupon(req.params.id).then(response => {
            res.json({status: response.status, message: response.message});
        })
    }

}  