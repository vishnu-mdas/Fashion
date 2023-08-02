const coupon = require("../../models/coupon");
module.exports = {
  
  
  addcoupons: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const couponName = data.couponcode; 
        data.couponcode = couponName.toUpperCase(); // Change couponCode to Upper Case
        const couponCheck = await coupon.findOne({couponCode: data.couponcode});
        console.log(couponCheck,'inside helper couponCheckkkkkkkkkkkkkk');
        if(!couponCheck){
        const coupons = new coupon({
          couponCode: data.couponcode,
          couponDiscount: data.coupondiscount,
          couponMinAmount: data.couponminamount,
          expireDate: data.expiredate, 
          Status: data.status,  
        }); 
        coupons.save(); 
        resolve({ status: true }); 
      } else{
        resolve({status: false, message: 'Coupon Name already exists'})
      }
        }
         catch (error) {
        reject(error);
      }
    });
  },

  showcoupons: (itemsPerPage, currentPage) => {
    return new Promise(async(resolve, reject) => {
      try {
        const skip = (currentPage - 1) * itemsPerPage;
        const totalCoupons = await coupon.countDocuments();
        const coupons = await coupon.find().skip(skip).limit(itemsPerPage);
        const totalPages = Math.ceil(totalCoupons / itemsPerPage);
        resolve({status: true, currentPage: currentPage, coupons: coupons, totalPages: totalPages})
      } catch (error) {
        res.status(500).send('An error occurred');
      }
        // const showcoupon = await coupon.find();
        // if(!showcoupon){
        //     resolve({status: false, message: 'Cant find the coupon collection'})
        // } else{
        //     resolve({status: true, showcoupon: showcoupon})
        // }
    })
  },

  editcoupon: (data) => {
    return new Promise(async(resolve, reject) => {
      const editcoupon = await coupon.findOne({_id: data});
      if(!editcoupon){
        resolve({status: false, message: 'Some Error Occured'})
      } else{
        resolve({status: true, editcoupon: editcoupon })
      }
    })
  },

  updatecoupon: (data, body) => {
    console.log('inside helperrrrrrr');
    return new Promise(async(resolve, reject) => {
      try{
        const updateCoupon = await coupon.findOneAndUpdate({_id: data},
          {couponCode: body.couponcode,
            couponDiscount: body.coupondiscount,
            couponMinAmount: body.couponminamount,
            expireDate: body.expiredate,
            Status: body.status
          })
          console.log(updateCoupon,'updatedCouponnnnnnnnnnn');
          resolve({status: true})
          if(!updateCoupon){
            resolve({status: false, message: 'Some Error Occured'})
          }
      } catch(error){
        reject(error);
      }
      
    })
  },

  deletecoupon: (data) => {
    return new Promise(async(resolve, reject) => {
      try{
        const deleteCoupon = await coupon.findOneAndDelete({_id: data});
        if(!deleteCoupon){
          resolve({status: false, message: 'Some Error Occured'});
        } else{
          resolve({status: true, message: 'Successfully Removed the Coupon', deleteCoupon: deleteCoupon})
        }
      } catch(error){
        reject(error);
      }
      

    })
  }


};