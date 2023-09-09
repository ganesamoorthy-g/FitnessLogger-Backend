const { Schema, model } = require("mongoose");

const AerobicSchema = new Schema(
  {
    type: {
      type: String,
      default: "aerobic",
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 30
    },
   
    heartRate: {
      type: Number,
      required: true,
    },
    caloriesBurned: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
);

const Aerobic = model("Aerobic", AerobicSchema);

module.exports = Aerobic;
