const express = require("express");
const Resistancemodel = require("../Models/Resistance.model"); 
const ResistanceRouter = express.Router(); 
const UserModel = require("../Models/Users.model");



ResistanceRouter.post("/createResistance", async (req, res) => {
    try {
      const { type, name, weight, sets,reps, date, userId } = req.body;
  
      // Create a new resistence entry
      const dbResistanceData = await Resistancemodel.create({
        type,
        name,
        weight,
        sets,
        reps,
        date,
        userId,
      });
  
      // Update the user's Resistance array with the new Resistance entry's ObjectId
      const dbUserData = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $push: { resistance: dbResistanceData._id } },
        { new: true }
      );
  
      if (!dbUserData) {
        // console.log("No user found with this id!");
        return res.status(404).json({ message: "Resistance created but no user with this id!" });
      }
  
      // console.log("Resistance successfully created!");
  
      // Log the custom response and send it
      const responseMessage = "Resistance successfully created!";
      // console.log("Response:", responseMessage);
      res.status(200).json({ message: responseMessage });
    } catch (err) {
      // console.error("Error:", err); 
      res.status(500).json(err);
    }
  });


  // Get Resistance by id
  ResistanceRouter.get("/getResistance/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const dbResistanceData = await Resistancemodel.find({ userId: id }); // Use userId to filter by user
  
      res.json(dbResistanceData || []); // Return an empty array if no cardio data found
    } catch (err) {
      res.status(500).json(err);
    }
  });
  



// Delete a resistance by ID
ResistanceRouter.delete("/deleteResistance/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the resistance data
    const dbResistanceData = await Resistancemodel.findOneAndDelete({ _id: id });

    if (!dbResistanceData) {
      return res.status(404).json({ message: "No resistance data found with this id!" });
    }

    // Find the user associated with the resistance data
    const user = await UserModel.findOne({ resistance: id });

    if (!user) {
      // Return success even if no associated user found
      return res.status(200).json({ message: "Resistance successfully deleted!" });
    }

    // Remove the resistence ID from the user's resistence array
    await UserModel.updateOne({ _id: user._id }, { $pull: { resistance: id } });

    // Return a 200 status code and a success message
    res.status(200).json({ message: "Resistance successfully deleted!" });
  } catch (err) {
    // console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Resistance by id
ResistanceRouter.patch("/updateResistance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Fields to update

    // Find the Resistence activity by ID and update the specified fields
    const dbResistanceData = await Resistancemodel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields }, // Use $set to update specific fields
      { new: true }
    );

    if (!dbResistanceData) {
      return res.status(404).json({ message: "No Resistance data found with this id!" });
    }

    res.json(dbResistanceData);
  } catch (err) {
    res.status(500).json(err);
  }
});
  
  module.exports = ResistanceRouter;