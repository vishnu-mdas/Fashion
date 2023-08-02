const mongoose=require('mongoose');
Schema=mongoose.Schema;

const cartSchema=new mongoose.Schema({
       userid:{ 
        type:mongoose.Schema.Types.ObjectId,
         ref:'user',
    },
    
    items:[{
         productid:{
            type:mongoose.Schema.Types.ObjectId,
             ref:'Products'
        },
        quantity:{type:Number,default: 1}
    }],
   
    Total: {
       type: Number
    }

})

const Cart= mongoose.model('Cart',cartSchema);

module.exports=Cart