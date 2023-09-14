const UserRouter = require("express").Router();
const UserModel = require("../Models/Users.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

// GET ALL THE USERS
UserRouter.get("/userId", (req, res, next) => {
  UserModel.find()
    .then((cursor) => {
      if (cursor && cursor.length > 0) {
        return res.status(200).json({
          data: cursor,
          success: true,
          message: "Users fetched successfully!!!",
        });
      } else {
        return res.status(200).json({
          data: [],
          success: true,
          message: "No Data Found!!!",
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        success: false,
        message: "Error Fetching Users Data!!!",
        error: err,
      });
    });
});


//get the single user


UserRouter.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  // Log the userId to verify that it's correctly extracted
  console.log('userId:', userId);

  // Use the userId in your Mongoose query to fetch user data
  UserModel.findById(userId)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          data: user,
          success: true,
          message: 'User fetched successfully!!!',
        });
      } else {
        return res.status(200).json({
          data: null,
          success: true,
          message: 'No User Found!!!',
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Error Fetching User Data!!!',
        error: err,
      });
    });
});





UserRouter.post("/create", (req, res, next) => {
  const data = req.body;
  let hashedPassword;

  bcrypt
    .hash(req.body.password, saltRounds)
    .then(function (hash) {
      hashedPassword = hash;

      const User = new UserModel({
      
        email: data.email,
        username: data.username, 
        password: hashedPassword,
      });

      User.save()
        .then((result) => {
          if (result && result._id) {
            return res.status(200).json({
              message: "User Created Successfully!!",
              data: result,
            });
          }
        })
        .catch((err) => {
          return res.status(401).json({
            message: "Alas! Error Creating User!!",
            error: err,
          });
        });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Error Hashing Password!!",
        error: err,
      });
    });
});


module.exports = UserRouter;
