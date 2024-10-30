const express = require("express")
const connectDb = require("../config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors");

{
 const User = require("../modal/user");
const {validateUserExist, validSignUpData} = require("../config/validate");
const jwt = require('jsonwebtoken') ;

const bcrypt = require("bcrypt");
const  userAuthen  = require("../middleware/userAuthen");
const SECRET_STRING ="PAYTM@KRO";
}




const app = express();

app.use(cors());
app.use(express.json()); //middleware for json-data
app.use(cookieParser());



const authUserRouter = require("../routes/authUser");
const requestRouter = require("../routes/request");
const transactionRouter = require("../routes/transaction");

 app.use("/", authUserRouter);
 app.use("/", requestRouter);
 app.use("/", transactionRouter)



{

// 1. update user - firstName, lastName, password
// 2. getAllUser - only names


// app.put("/updateUser", userAuthen,async (req, res) => {
//     try{
//         //extract all credential 
//         const{firstName, lastName, password}= req.body;
//         //validate credential 
//         //send to db 

//     }catch(err)
//     {
//         res.status(400).json({
//             message: "error during update user -"+err.message,
//         })
//     }
// })




// app.post("/signUp" , async(req, res) => {

//     try{
//         // validating data send by user
//         // validateSignUpData(req);
//         validSignUpData(req);
//          //hashing the password before saving it into db
//          const {firstName, lastName, emailId, password } = req.body;
//          const hashedPassword = await bcrypt.hash(password, 10);

//          const user = new User({ 
//             firstName: firstName,
//             lastName: lastName,
//             emailId: emailId,
//             password: hashedPassword 
//          })
      
//        await user.save();

//        res.status(200).json({
//         user,
//         message : "user added successfully"
//        })
//     }
//     catch(err)
//     {
//         res.status(400).send("not able to add User")
//     }
    
// })




// app.get("/signIn", async (req, res) => {

//     try{
//         /* 1. extract email and pass
//        2. validate func for user in db and give back user
//        3. make a token for the user 
//        4. send the successfull message to user
//     */

//        const{emailId} = req.body;
        
//        //validate user and password
//         const userExist = validateUserExist(req); 
//         if(!userExist)
//         {
//            return res.send("user not exist");
//         }

//         //create jwt token for the user
//         const token = await jwt.sign({emailId: emailId },  SECRET_STRING, {expiresIn: "1d"});

//         res.cookie("token", token);

//         res.send("token send successfully");
//     }

//     catch(err)
//     {
//         res.status(400).send("not able to sign in the user");
//     }

// });



// app.get("/profile", userAuthen, (req, res, next) => {
//     try {
//         const user = req.user; // This requires userAuthen to set req.user

//         if (!user) {
//             return res.status(401).json({ message: "Unauthorized access" });
//         }

//         res.json({
//             user,
//             message: "Profile sent successfully"
//         });
//     } catch (error) {
//         next(error); // Pass errors to Express error handler
//     }
// });




// app.post("/user", async (req, res) => {

//     try{
//         const user = new User({
//             firstName : "virat",
//             lastName: "kholi",
//             emailId : "vk@gamil.com",
//             password: "Viratkholi@123"
//         })
        
//         await user.save();
//         res.send("User add Successfully")
        
//     }
//     catch(err){
//         res.status(400).send("not able to send the data to db");
//     }
// })


}




connectDb()
.then( () => {
    console.log("connected to database");
    app.listen(3000, () => {
        console.log("listening on port 3000"); 
    })
})
.catch( () => {
    console.log("not able to connect to database ");
    
})