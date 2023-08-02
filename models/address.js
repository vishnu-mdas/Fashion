const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    address: [{
        fname: String,

        lname: String,

        houseName: String,

        villageName: String,
        
        city: String,

        district: String,

        pincode: Number,
            
        state: String
            
    }]
    })

const address = mongoose.model('address', addressSchema);

module.exports = address;