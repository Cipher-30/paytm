const jwt = require('jsonwebtoken');
const User = require("../modal/user")

const SECRET_STRING = "PAYTM@KRO";
const userAuthen = async (req,res, next) => {

    try{
        const {token} = req.cookies;

        if(!token)
        {
           throw new Error("token not exist");
        }
   
        const decodeMess = jwt.verify(token, SECRET_STRING);
           const emailId = decodeMess.emailId;
     
       const user = await User.findOne({emailId});

       if(!user)
       {
        return res.status(404).json({ message: "User not found" });
       }

       req.user = user;
 
       next();


    }
    catch(err)
    {
        res.status(401).json({ message: "Authorization error: " + err.message });
    }
         
} ;

module.exports = userAuthen; 