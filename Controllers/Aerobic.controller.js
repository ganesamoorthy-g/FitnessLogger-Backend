const express = require("express");
const Aerobicmodel = require("../Models/Aerobic.model"); 
const AerobicRouter = express.Router(); 
const UserModel = require("../Models/Users.model");



AerobicRouter.post("/createAerobic", async (req, res) => {
    try {
      const { type, name,heartRate,caloriesBurned, date, userId } = req.body;
  
      // Create a new Aerobic entry
      const dbAerobicData = await Aerobicmodel.create({
        type,
        name,
        heartRate,
        caloriesBurned,
        date,
        userId,
      });
  
      // Update the user's Aerobic array with the new Aerobic entry's ObjectId
      const dbUserData = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $push: { aerobic: dbAerobicData._id } },
        { new: true }
      );
  
      if (!dbUserData) {
        // console.log("No user found with this id!");
        return res.status(404).json({ message: "Aerobic created but no user with this id!" });
      }
  
      // console.log("Aerobic successfully created!");
  
      // Log the custom response and send it
      const responseMessage = "Aerobic successfully created!";
      // console.log("Response:", responseMessage);
      res.status(200).json({ message: responseMessage });
    } catch (err) {
      // console.error("Error:", err); 
      res.status(500).json(err);
    }
  });


  // Get Aerobic by id
  AerobicRouter.get("/getAerobic/:id", async (req, res) => {
    try {
      const { id } = req.params;
  // Use userId to filter by user
      const dbAerobicData = await Aerobicmodel.find({ userId: id }); 
  // Return an empty array if no cardio data found
      res.json(dbAerobicData || []); 
    } catch (err) {
      res.status(500).json(err);
    }
  });



// Delete a Aerobic by ID
AerobicRouter.delete("/deleteAerobic/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the Aerobic data
    const dbAerobicData = await Aerobicmodel.findOneAndDelete({ _id: id });

    if (!dbAerobicData) {
      return res.status(404).json({ message: "No Aerobic data found with this id!" });
    }

    // Find the user associated with the Aerobic data
    const user = await UserModel.findOne({ aerobic: id });

    if (!user) {
      // Return success even if no associated user found
      return res.status(200).json({ message: "Aerobic  successfully deleted!" });
    }

    // Remove the Aerobic ID from the user's Aerobic array
    await UserModel.updateOne({ _id: user._id }, { $pull: { aerobic: id } });

    // Return a 200 status code and a success message
    res.status(200).json({ message: "Aerobic successfully deleted!" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});



// Update Aerobic by id

AerobicRouter.patch("/updateAerobic/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Fields to update

    // Find the Aerobic activity by ID and update the specified fields
    const dbAerobicData = await Aerobicmodel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields }, // Use $set to update specific fields
      { new: true }
    );

    if (!dbAerobicData) {
      return res.status(404).json({ message: "No Aerobic data found with this id!" });
    }

    res.json(dbAerobicData);
  } catch (err) {
    res.status(500).json(err);
  }
});
  
  
  module.exports = AerobicRouter;