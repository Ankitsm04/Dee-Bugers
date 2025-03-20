const mongoose = require("mongoose");

// const URI = "mongodb://127.0.0.1:27017/mern_admin";
// mongoose.connect(URI);

const URI = "mongodb+srv://Shyam:qwertyuiop@cluster0.ivwwfxx.mongodb.net/Techaton?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = async ()=>{
    try {
        await mongoose.connect(URI);
        console.log("Connection Successfull")
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

module.exports = connectDb;