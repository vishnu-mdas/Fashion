const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceid = process.env.SERVICEID
const client = require('twilio')(accountSid, authToken);




module.exports = {
    sendotp: (usermobile)=>{
        return new Promise((resolve,reject)=>{
            client.verify.v2.services(serviceid)
            .verifications
            .create({to: `+91${usermobile}`, channel: 'sms'})
            .then((verification) => {
                console.log(verification.status)
                resolve(verification);
            });
        })
    },

    verifyotp: (usermobile,otp)=>{
        return new Promise((resolve,reject)=>{
            client.verify.v2.services(serviceid)
                .verificationChecks     
                .create({to: `+91${usermobile}`, code: otp})
                .then((verification_check) => {
                    console.log(verification_check.status)
                    resolve (verification_check.valid)
                });
        })
    }
}