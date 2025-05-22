const mongoose = require('mongoose');

const dbConnect = async () => {
    try{
       await mongoose.connect(process.env.MONGO_URI);
       console.log("mongodb connect successfully");
    }catch(error){
        console.error("Error while connecting to database",error.message);
        process.exit(1);
    }
}

module.exports = dbConnect;