const express = require("express");
const userAuthen = require("../middleware/userAuthen");
const User = require("../modal/user");
const { validUpdate } = require("../config/validate");
const requestRouter = express.Router();



// requestRouter.get("/searchUser", userAuthen, async (req, res) => {
//     try {


//         const { user } = req.query;
//         console.log(user) 

//         let data = user;

//         // find it into the db
//         const users = await User.find{
//           $or: [
//             {firstName: }
//           ]    
//         }

//     } 
//     catch (err) {
//         res.status(400).json({
//             message: "not able to fetch the user" + err.message,

//         })
//     }
// })



requestRouter.get("/find", userAuthen, async (req, res, next) => {
    try {

         const SAFE_DATA = ["firstName", "lastname"];
        // console.log("filter =", req.query.filter);

        const query = req.query.filter || "";

        const users = await User.find({
            $or: [
                {
                    firstName: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    lastName: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        })

        if (!users) {
            res.status(400).json({
                message: "not able to fetch the user during find!!"
            })
        }


        //--------------- FILTERING THE THE SAFE DATA --------

        // const data = Object.keys(users).filter( (field) => ( field.includes(SAFE_DATA) ));

        // const data = users.map( (obj) => (
        //       (Object.keys(obj) == "firstName")) 
        // )


        res.json({
            users,
            message: "was able to find the user successfully!!"
        })

    }
    catch (err) {
        res.status(400).json({
            message: "not able to get the user from the database" + err.message,
        })
    }
})





// view profile current user 
requestRouter.get("/profile", userAuthen, (req, res, next) => {
    try {
        const user = req.user; // This requires userAuthen to set req.user

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        res.json({
            user,
            message: "Profile sent successfully"
        });
    } catch (error) {
        next(error); // Pass errors to Express error handler
    }
});


//update credentials
requestRouter.patch("/updateUser", userAuthen, async (req, res, next) => {

    try {
        const isUpdateFieldValid = validUpdate(req);

        if (!isUpdateFieldValid) {
            throw new Error("parameter to update not valid")
        }


        const loggedInUser = req.user;
        const user = await User.findByIdAndUpdate({ _id: loggedInUser._id }, req.body, { new: true })

        await user.save();

        res.json({
            user,
            messagge: "update user"
        })

    } catch (err) {
        res.status(400).json({
            message: "not valid" + err.message,
        })
    }

});


// give all users names
requestRouter.get("/allUser", userAuthen, async (req, res, next) => {

    const allUser = await User.find({});

    const users = allUser.map((user) =>
    (
        {
            firstName: user.firstName,
            lastName: user.lastName
        }
    )
    )

    res.send(users);
})







module.exports = requestRouter;