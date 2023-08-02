const banner = require('../../models/banner');

module.exports = {
    addbanner: (data, files) => {
        if(data.status === 'enable'){
           data.status = true;
        }
        else{
            data.status = false;
        }
        const images = files.map((file) => file.filename);
        return new Promise(async(resolve,reject)=>{
            try{
                
                const banners = new banner({
                    Title: data.bannername,
                    Message: data.bannerMessage,
                    Description: data.bannerDescription,
                    ButtonName: data.buttonName,
                    ButtonUrl: data.buttonLink,
                    StartDate: data.startdate,
                    EndDate: data.enddate,
                    Image: images,
                    Status: data.status 
                })
                banners.save();
                resolve({status: true, message: 'banner added successfully'})
            }
            catch(error){
                reject(error);
            }
        })
    },

    getBanner: (itemsPerPage, currentPage) => {
        return new Promise(async(resolve, reject) => {
            try {
                const skip = (currentPage - 1) * itemsPerPage;
                const totalBanners = await banner.countDocuments();
                const banners = await banner.find().skip(skip).limit(itemsPerPage);
                const totalPages = Math.ceil(totalBanners / itemsPerPage);
                resolve({currentPage: currentPage, banners: banners, totalPages: totalPages})
              } catch (error) {
                res.status(500).send('An error occurred');
              }
            // try{
            //     const getbanner = await banner.find();
            //     if(!getbanner){
            //         resolve({status: false, message: 'Banner not found'})
            //     }
            //     else{
            //         resolve({getbanner: getbanner, status: true})
            //     }
            // }
            // catch(error){
            //     reject(error);
            // }
        })
    },

    editbanner: (bannerId) => {
        return new Promise(async(resolve,reject)=>{
            const editBanner = await banner.findOne({_id: bannerId});
            if(!editBanner){
                resolve({status: false, message: 'Some Errors Occured'});
            }
            else{
                resolve({editBanner: editBanner, status: true})
            }
        }) 
    },

    getActiveBanner: () => {
        return new Promise(async(resolve, reject) => {
            const activeBanner = await banner.find({Status: true});
            if(!activeBanner){
                resolve({status: false, message: 'Banner not available'});
            }
            else{
                resolve({status: true, activeBanner})
            }
        })
    },

    updatebanner: (bannerId, data,files) => {
        return new Promise(async(resolve, reject) => {
            try{
                let images = files.map((file) => file.filename);
                if(data.status === 'enable'){
                    data.status = true;
                 }
                 else{
                     data.status = false;
                 }
                const updatedBanner = await banner.findOneAndUpdate({_id: bannerId},
                    {Title: data.bannername, Message: data.bannerMessage, Description: data.bannerDescription, ButtonName: data.buttonName,
                         ButtonUrl: data.buttonLink, StartDate: data.startdate, EndDate: data.enddate, Status: data.status, Image: images });
                         if(!updatedBanner){
                    resolve({status: false, message: 'Banner Not Available'})
                }
                else{
                    resolve({status: true, message: ' Successfully Updated the Banner'})
                }
            }
            catch(error){
                reject(error);
            }
        })
    },

    deletebanner: (bannerId) => {
        console.log('inside helperrrrrrrrrrrrrrrrrrrrr');
        return new Promise(async(resolve, reject) => {
            try{
                const delBanner = await banner.findOneAndRemove({_id: bannerId})
                console.log(delBanner,'delbannerrrrrrrrrrrrrrrrrrrrrrr');
                if(!delBanner){
                    resolve({status: false, message: 'Some Error Occured while deleting the banner'});
                } else{
                    const updatedBanner = await banner.find();
                    if(!updatedBanner){
                        resolve({status: false, message: 'Some Error Occured while deleting the banner'});
                    } else{
                        resolve({status: true, message: 'Deleted Successfully', updatedBanner: updatedBanner});
                    }
                    
                }
            }catch(error){
                reject(error);
            }
        })
    }
}