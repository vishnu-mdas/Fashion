const mongoose=require('mongoose');

const userSchema=new mongoose.Schema( {
    userId:{ type:String},
    userName:{ type:String,required:true},
    userMobile:{type:Number,required:true,unique:true},
    userEmail:{ type:String,required:true,unique:true},
    userPassword:{ type:String,required:true},
    userAddress:{ type:Array},
    userCart:{type:Array},
    isBlocked:{type:Boolean},
    userWishlist:{type:Array},
    userOrders:{type:Array},
    isApproved:{type:Boolean},

    addressOne:{ type:mongoose.Schema.Types.ObjectId,
        ref:'address',

    }

})

const User= mongoose.model('user',userSchema);

module.exports=User