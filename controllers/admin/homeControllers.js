const {getSalesDetails, getYearlySalesDetails, adminAllOrders, getOrdersByDate,
  getCategorySales, fetchallProducts, getAllUsers} = require("../../helper/dashboardHelper/dashboard-helper");

module.exports = {
    middleware: (req,res,next)=>{
        res.locals.admin= true;
        next();
    },
    displayDashboard: (req, res)=>{
      res.render("admin/dashboard", {});
    },

    dashboard: async (req, res) => {
        try {
          const salesByMonth = await getSalesDetails();
          const salesByYear = await getYearlySalesDetails();
          const orders = await adminAllOrders();
          const ordersByDate = await getOrdersByDate();
          const categorySales = await getCategorySales(); 
          const allProducts = await fetchallProducts();
          const allUsers = await getAllUsers();
          const currentMonth = new Date().getMonth() + 1;
          const currentMonthSales = await salesByMonth.find(
            (sales) => sales._id === currentMonth
          );
        console.log(salesByMonth,"11111111",
          salesByYear,"2222222",
          orders,"3333333",
          ordersByDate,"4444444",
          categorySales,"5555555",
          allProducts,"6666666",
          allUsers,"77777777",
          currentMonthSales,"8888888888");


          res.status(200).json({salesByMonth,
            salesByYear,
            orders,
            ordersByDate,
            categorySales,
            allProducts,
            allUsers,
            currentMonthSales
          });
        } catch (error) {
          console.log(error.message);
        }
      },


}