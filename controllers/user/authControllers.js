const { response } = require("express");
const {doSignup, doLogin,validateUser,updatePassword} = require('../../helper/userHelper/user-helper');
const otpController = require("./otpController");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceid = process.env.SERVICEID
const client = require('twilio')(accountSid, authToken);
 
let mob = null;
module.exports = {

    middleware: (req,res,next)=> {
        
        if(req.session.userLogin){
            res.locals.user= req.session.user
        }
        next()
    },

     userLogin:(req, res) => {
      // Check if the user is already logged in
      if (req.session.userLogin) {
          return res.redirect('/');
      }
  
      // Check if the user is blocked
      if (req.session.isBlocked) {
          // Clear the block status from the session after displaying the message
          req.session.isBlocked = false;
          return res.render('user/login', { blockedMessage: 'Your account is blocked. Please contact the administrator.' });
      }
  
      // Render the login page without any blocked message
      res.render('user/login', { blockedMessage: null });
  },
  

    userSignup:(req,res)=>{
    res.render('user/signup');
},

    signupData:(req,res)=>{  
        console.log(',,,,,,,,,,,,,');
        doSignup(req.body).then((response)=>{
            console.log(response);
            
            if(response.status){
            
             res.redirect('/login')   
            }else{

                res.render('user/signup',{ errorMessage: response.message});
            }
           
        })      
    },
    loginData:(req,res)=>{
        doLogin(req.body).then((response)=>{
            if(response.status){
                req.session.userLogin=true
                req.session.user= response.user._id
                console.log(response.user,'****Check session user***');
                
                res.redirect('/')
            }else{
                res.render('user/login')
            }
        })

    },
     
    forgotPassword:(req,res)=>{
      res.render('user/forgotpassword', {message:''});
    },

    checkUser: (req, res) => {
        const phone = req.body;
        console.log(phone, 'phone numberrrrrrrrrrr or nottttttttt');
        validateUser(phone).then((response) => {
          if (response) {
            mob = phone.mobilenumber;
            otpController.sendOtp(phone).then((otpResponse) => {
              if (otpResponse === "pending") {
                res.redirect('/otppage');
              } else {
                // Handle the case where sending OTP failed or returned a status other than "pending"
                // For example, you could render an error page or display an error message
                res.send("Error sending OTP");
              }
            }).catch((error) => {
              // Handle any errors that occur during OTP sending
              console.log("Error sending OTP:", error);
              res.send("Error sending OTP");
            });
          } else {
            // No user found
            // res.render('user/forgotpassword',{remsg2:true,phone})
            // res.send("No user found");
            const message = "This number is not Registered";
            
      res.render('user/forgotpassword', { message });
          }
        }).catch((error) => {
          // Handle any errors that occur during user validation
          console.log("Error while validating user:", error);
          res.send("Error while validating user");
        });

      },

      otpauthentication: (req, res) => {
        otpController.verifyOtp(req.body).then((response) => {
          console.log(response, 'otp auth responseeeeeeeeee');
          if (response) {
            res.redirect('/resetpassword');
          } else {
            // Handle failed OTP verification
            res.send('OTP verification failed.'); // You can render an error page or display a message
          }
        }).catch((error) => {
          // Handle errors that occur during OTP verification
          console.log('Error during OTP verification:', error);
          res.send('Error during OTP verification.');
        });
      },

// otp verify page get 
   otpverification:(req,res)=>{
res.render('user/otpverifypage')
   },

resetPassword:(req,res)=>{
  res.render('user/resetpassword')
},

   updatePassword:(req,res)=>{
    const userData = req.body;
        console.log(userData,'iuhiuhuuuuuuuuuuuu');
        updatePassword(userData,mob).then((result) => {
            if(result){
                res.redirect('/login');
            } else {
                res.redirect('/forgotPassword');
            }
        })
 },

 logOut:(req,res)=>{
        req.session.userLogin=false
        req.session.user=null
        res.redirect('/login')
    }
}
