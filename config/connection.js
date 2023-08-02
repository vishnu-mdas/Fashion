var mongoose=require('mongoose');
require('dotenv').config()
const {mongooseurl}= process.env
const connect=async()=>{
    try{
        await mongoose.connect(mongooseurl,{dbName:"vishnumohan",useNewUrlParser:true,
        useUnifiedTopology:true})
        console.log("Database connected succesfully to server");
    }
    catch (err){
        console.log(err);
    }
}

connect()