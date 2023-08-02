const response= require ('express')
const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceid = process.env.TWILIO_SERVICE_ID;
const client = require('twilio')(accountSid, authToken);

const countryCode = '+91';

let sentTime;
let currentTime;
let timelimit = '60';
let mobNum = null;
module.exports = {
    sendOtp: (userData) => {
        console.log(userData,'mobileeeeeeeeeeeeeeeeeen');
      return new Promise((resolve, reject) => {
        mobNum = userData.mobilenumber
        client.verify.v2.services(serviceid)
          .verifications
          .create({ to: countryCode + mobNum, channel: 'sms' })
          .then((verification) => {
            console.log("SEND OTP STATUS:", verification.status);
            console.log("SEND OTP DATA:", countryCode + userData.mobilenumber);
            
            resolve(verification.status);
          })
          .catch((error) => {
            resolve(false);
            console.log("ERROR MESSAGE FROM TWILIO:", error.message);
          });
      });
    },
  
    verifyOtp: (userData) => {
        console.log(userData,'userdataaaaaaaaaaaaa');
      return new Promise((resolve, reject) => {
        client.verify.v2.services(serviceid)
          .verificationChecks
          .create({ to: countryCode + mobNum, code: userData.otp })
          .then((verification_check) => {
            
            console.log(userData.otp);
                console.log("Twilio verification status:", verification_check.status);
                resolve(verification_check.valid);
          })
          .catch((error) => {
            console.log("Twilio verify error:", error.message);
          });
      });
    },
  };