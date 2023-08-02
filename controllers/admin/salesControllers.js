const adminHelper = require("../../helper/adminHelper/admin-helper")

module.exports = {
    salesReport: (req, res) => {
        adminHelper.salesReport().then(response => {
            if(response.status){
                const salesreports = response.salesreport;
                res.render('admin/salesReport', {orders: salesreports})
            } else{
                res.redirect('/admin')
            }
        })
        
    }
}