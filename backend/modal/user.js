const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
        trim:true,
        validate(value) //will run on every value input
        {
            if(value.length < 8 || !/[a-zA-Z]/.test(value) || !/\d/.test(value))
            {
                throw new Error("password weak");
            }
        },
    },
    emailId: {
        type:String,
        require:true,
        unique:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Email Id is not valid");
            }
        }
    }
},
{
    timestamps:true
})

const User = mongoose.model("User", userSchema);

module.exports = User;