const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
    
    adminName:{ type:String,required:true},
    adminEmail:{ type:String,required:true,unique:true},
    adminPassword:{ type:String,required:true}

})

const Admin= mongoose.model('admins',adminSchema);

module.exports=Admin