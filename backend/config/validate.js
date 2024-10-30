const validator = require("validator");
const User = require("../modal/user")
const bcrypt = require('bcrypt')

const validSignUpData = (req) => {

    const {firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName)
    {
        throw new Error("Insufficient data for Name");
    }
    else if( !validator.isEmail(emailId))
    {
        throw new Error("Email Id not valid");
    }
    else if( !validator.isStrongPassword(password))
    {
        throw new Error("Password is not Strong");
    }

}
 
const validateUserExist = async (req) => {
   try{
    const{emailId, password} = req.body;
    // db call to check user exist 
    const user = await User.findOne({emailId});
    if(!user)
    {
        throw new Error("validateUserExist - not exist ")
    }


    const hashedPassword = user.password;
    //check pass with hashed pssword
      const isValidPassword = await bcrypt.compare(password, hashedPassword);
      return isValidPassword;

   }
   catch(err)
   {
     throw new Error("validateUserExist - error occurred")
   }


}



const validUpdate = ( req) => {

    const ALLOWED_UPDATES = ['firstName', 'lastName', 'password'];
    const reqUpdate = req.body;

    const isUpdateValid = Object.keys(reqUpdate).every( (field) => ( ALLOWED_UPDATES.includes(field) ) );

    return isUpdateValid;
}

module.exports = 
{
    validSignUpData, 
    validateUserExist ,
    validUpdate

};