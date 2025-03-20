const mongoose = require('mongoose');
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    }
});

userSchema.pre('save', async function(next){
    const user = this;

    if(!user.isModified('password')){
        next();
    }

    try {
        const salt = await bycrypt.genSalt(10);
        const password_hash = await bycrypt.hash(user.password, salt);
        user.password = password_hash;
    } catch (error) {
        next(error);
    }
})

userSchema.methods.generateToken = async function(){
    try {
        return jwt.sign({
            userId : this._id.toString(),
            email : this.email,
            isAdmin : this.isAdmin,
        },"SEAD",
    {
        expiresIn:"30d",
    }
)
        
    } catch (error) {
        console.log(error);
    }
};


//Defining a model or the collection name
const User = new mongoose.model("User", userSchema);

module.exports = User;