const { Schema, model } = require("mongoose");

const CardioSchema = new Schema(
  {
    type: {
      type: String,
      default: "cardio",
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 30,
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    // Add a reference to the User model for userId
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming 'User' is the name of your User model
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt
  }
);

const Cardio = model("Cardio", CardioSchema);
module.exports = Cardio;
