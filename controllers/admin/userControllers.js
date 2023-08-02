const { response } = require("express")
const Order= require('../../models/order')
const adminHelper = require("../../helper/adminHelper/admin-helper")

module.exports={
    usersList: ( req, res) => { 
      
         adminHelper.getAllUsers().then((response) => {
            let userlist= response;
           console.log(userlist,'userlistssssssssssssssss');
            res.render('admin/users',{userlist})
         });
    },
    
        getOrders: (req,res) => {
            console.log('inside controllerrrrrr');
            adminHelper.getAllOrders().then((response) => {
                const orderList=response;
                console.log(orderList,'orderlistttttttttttttt');
                res.render('admin/orders',{orderList})
            })
        },
 
        vieworderedProduct:(req, res) => {
            adminHelper.viewOrderedProducts(req.params.id).then(orderDetails => {
                res.render('admin/vieworderDetails', { orderDetails })
            })
          },
     
 


           blockUser: (req, res) => {
            console.log('inside controller block user');
            adminHelper.blockuser(req.params.id)
                .then(response => {
                    if (response.status) {
                        // Set session variable to indicate that the user is blocked
                        req.session.isBlocked = true;
                        // Clear the user session to sign them out immediately
                        req.session.destroy((err) => {
                            if (err) {
                                res.status(500).json({ error: 'An error occurred while blocking the user' });
                            } else {
                                res.json({ user: response.users, message: 'User blocked successfully' });
                            }
                        });
                    } else {
                        res.status(500).json({ error: 'An error occurred while blocking the user' });
                    }
                })
                .catch((error) => {
                    res.status(500).json({ error: 'An error occurred while blocking the user' });
                });
        },
        

        unBlockUser: (req,res) => {
           adminHelper.unBlockuser(req.params.id).then(response => {
                if(response.status){
                    res.json({ user: response.users, message: 'User unblocked successfully' });
                }
                else{
                    res.status(500).json({ error: 'An error occurred while unblocking the user' });
                }
            })
            .catch((error) => {
                res.status(500).json({ error: 'An error occurred while unblocking the user' });
              });
        }
    }
    
