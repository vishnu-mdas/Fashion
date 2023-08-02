const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({ 
    Title: String,
    Message: String,
    Description: String,
    ButtonName: String,
    ButtonUrl: String,
    StartDate: Date,
    EndDate: Date,
    Image: Array,
    Status: Boolean 
});

module.exports = mongoose.model('Banner', bannerSchema);