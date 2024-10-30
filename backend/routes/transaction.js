const express = require("express");
const mongoose = require("mongoose");
const userAuthen = require("../middleware/userAuthen");
const Account = require("../modal/account");
const User = require("../modal/user");
const transactionRouter = express.Router();






transactionRouter.post("/transaction", userAuthen, async (req, res) => {
  try {

    // start session 
    const session = await mongoose.startSession();
    session.startTransaction();

    const { toUser, amount } = req.body;
    const { _id } = req.user;


    // console.log("_id = ", _id);
    // console.log("toUser = ", toUser);
    // console.log("amount = ", amount);


    //user can't be same
    if (_id == toUser) {
      session.abortTransaction();
      throw new  Error( "can't send money to yourself ")
    }

    //r-user exist or not
    const recevingUser = await User.findOne({ _id: toUser }).session(session);
    if (!recevingUser) {
      session.abortTransaction();
      throw new  Error( "r_User not exist")
    }

    //balance is low
    const currBalance = await Account.findOne({ userId: _id }).session(session);
    if (currBalance.balance < amount) {
      session.abortTransaction();
      throw new  Error( "insufficient balance")
    }

    //transaction
    await Account.updateOne({ userId: _id },
      {
        $inc: {
          balance: -amount
        }
      }).session(session)

    await Account.updateOne({ userId: toUser },
      {
        $inc: { balance: amount }
      }).session(session);


    session.commitTransaction();


    res.send("transaction done successfully ");

  }
  catch (err) {
    res.status(400).json({
      message: "transaction wasn't able to compelete " + err.message,

    })

  }






})




transactionRouter.get("/balance", userAuthen, async (req, res) => {
  try {
    const { _id } = req.user;
    const userId = _id.toString();
    //   console.log(userId);

    const currBalance = await Account.findOne({ userId: userId });

    if (!currBalance) {
      throw new Error("unable to fetch balance from db")
    }
    const balance = currBalance.balance;

    res.json({
      balance,
      message: "send balance successfully"
    })

  } catch (err) {
    res.status(400).json({
      message: "something went wrong during balance checking " + err.message,
    })
  }

})



module.exports = transactionRouter;