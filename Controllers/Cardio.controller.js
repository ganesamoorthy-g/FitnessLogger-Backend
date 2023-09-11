const express = require("express");
const Cardiomodel = require("../Models/Cardio.model");
const CardioRouter = express.Router();
const UserModel = require("../Models/Users.model");

// Create cardio route handler
CardioRouter.post("/createCardio", async (req, res) => {
  try {
    const { type, name, distance, duration, date, userId } = req.body;

    // Create a new cardio entry
    const dbCardioData = await Cardiomodel.create({
      type,
      name,
      distance,
      duration,
      date,
      userId,
    });

    // Update the user's cardio array with the new cardio entry's ObjectId
    const dbUserData = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { cardio: dbCardioData._id } },
      { new: true }
    );

    if (!dbUserData) {
      // console.log("No user found with this id!");
      return res.status(404).json({ message: "Cardio created but no user with this id!" });
    }

    // console.log("Cardio successfully created!");

    // Log the custom response and send it
    const responseMessage = "Cardio successfully created!";
    // console.log("Response:", responseMessage);
    res.status(200).json({ message: responseMessage });
  } catch (err) {
    // console.error("Error:", err);
    res.status(500).json(err);
  }
});


// Get cardio by id
CardioRouter.get("/getCardio/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const dbCardioData = await Cardiomodel.find({ userId: id }); // Use userId to filter by user

    res.json(dbCardioData || []); // Return an empty array if no cardio data found
  } catch (err) {
    res.status(500).json(err);
  }
});



// Delete cardio data
CardioRouter.delete("/deleteCardio/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the resistence data
    const dbCardioData = await Cardiomodel.findOneAndDelete({ _id: id });

    if (!dbCardioData) {
      return res.status(404).json({ message: "No Cardio data found with this id!" });
    }

    // Find the user associated with the Cardio data
    const user = await UserModel.findOne({ cardio: id });

    if (!user) {
      // Return success even if no associated user found
      return res.status(200).json({ message: "Cardio successfully deleted!" });
    }

    // Remove the Cardio ID from the user's resistence array
    await UserModel.updateOne({ _id: user._id }, { $pull: { cardio: id } });

    // Return a 200 status code and a success message
    res.status(200).json({ message: "Cardio successfully deleted!" });
  } catch (err) {
    // console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});


// Update Aerobic by id
CardioRouter.patch("/updateCardio/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Fields to update (excluding _id)

    // Ensure that the _id field is not included in the updateFields
    delete updateFields._id;

    // Find the Cardio activity by ID and update the specified fields
    const dbCardioData = await Cardiomodel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields }, // Use $set to update specific fields
      { new: true }
    );

    if (!dbCardioData) {
      return res.status(404).json({ message: "No Cardio data found with this id!" });
    }

    res.json(dbCardioData);
  } catch (err) {
    // console.error(err); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = CardioRouter;
















