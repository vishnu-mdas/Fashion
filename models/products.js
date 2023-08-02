const mongoose=require('mongoose');


const productsSchema=new mongoose.Schema( {
    
    productTitle:{ type:String,required:true},
    description:{ type:String,required:true},
    offerPrice:{ type:Number,required:true},
    orginalPrice:{ type:Number,required:true},
    image:{ type:Array,required:true},
    category:{ type:String},
    stock:{ type:Number,required:true},
    deleteStatus:Boolean
},{timestamps:true})

const  Products= mongoose.model('Products',productsSchema);

module.exports=Products