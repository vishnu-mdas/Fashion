const mongoose= require('mongoose')

const wishlistSchema =new mongoose.Schema( {

    userId:{
        type: mongoose.Schema.Types.ObjectId
    },
    items: [{
        prodId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
        }
    }]

});

const Wishlist=mongoose.model('Wishlist',wishlistSchema);

module.exports= Wishlist