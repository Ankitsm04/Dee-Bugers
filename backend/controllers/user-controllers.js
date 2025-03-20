const User = require('../models/user-models');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported

const Register = async (req, res) => {
    const { username, email, password, phone } = req.body;
    const userExist = await User.findOne({email:email});
    try {
        if(email === "" || password === "" || username === "" || phone === ""){
            return res.status(400).json({
                "message" : "Please fill all the fields",
            });
        }

        if(userExist){
            return res.status(400).json({
                "message" : "User already exists",
            });
        }

        const userCreated = await User.create({username, email, phone, password});

        res.status(201).json({
            "Message": "User registered Successfully", 
            "token": await userCreated.generateToken(),
            "userId" : userCreated._id.toString(),
        });
    } catch (error) {
        res.status(400).json({
            "message" : error,
        });
    }
}


const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email: email });

        if (!userExists) {
            return res.status(400).json({
                message: "User does not exist",
            });
        }

        const isMatch = await bcrypt.compare(password, userExists.password);

        if (isMatch) {
            res.status(200).json({
                message: "Logged in Successfully",
                token: await userExists.generateToken(),
                userId: userExists._id.toString(),
            });
        } else {
            res.status(401).json({
                message: "Invalid password"
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            details: error.message,
        });
    }
};

module.exports = {Register, Login};