const mongoose = require('mongoose');
Schema=mongoose.Schema;

const categorySchema = new mongoose.Schema({
    categoryName: {type: String},
    hiddenstatus:{type: Boolean, default:false}
  });
  
  const category = mongoose.model('category', categorySchema);
  
  module.exports = category;