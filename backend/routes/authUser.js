const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken') ;
const SECRET_STRING ="PAYTM@KRO";

const { validSignUpData, validateUserExist } = require("../config/validate");
const User = require("../modal/user");
const authUserRouter = express.Router();
const Account = require("../modal/account");





authUserRouter.post("/signUp" , async(req, res) => {

    try{
        // validating data send by user
        // validateSignUpData(req);
        validSignUpData(req);
         //hashing the password before saving it into db
         const {firstName, lastName, emailId, password } = req.body;
         const hashedPassword = await bcrypt.hash(password, 10);

         const user = new User({ 
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: hashedPassword 
         })

         const userId = user._id;
       


          const account = new Account({
            userId,
            balance: parseInt(Math.random() * 10000),
          });

          await account.save();

          
      
       await user.save();

       res.status(200).json({
        user,
        message : "user added successfully"
       })
    }
    catch(err)
    {
        res.status(400).send("not able to add User")
    }
    
})







authUserRouter.get("/signIn", async (req, res) => {

    try{
        /* 1. extract email and pass
       2. validate func for user in db and give back user
       3. make a token for the user 
       4. send the successfull message to user
    */

       const{emailId} = req.body;
        
       //validate user and password
        const userExist = validateUserExist(req); 
        if(!userExist)
        {
           return res.send("user not exist");
        }

        //create jwt token for the user
        const token = await jwt.sign({emailId: emailId },  SECRET_STRING, {expiresIn: "1d"});

        res.cookie("token", token);

        res.send("token send successfully");
    }

    catch(err)
    {
        res.status(400).send("not able to sign in the user");
    }

});





module.exports = authUserRouter;

