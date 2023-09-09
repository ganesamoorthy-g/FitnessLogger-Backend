



const mongoose = require("mongoose");

const BASE_URL =
  process.env.NODE_ENVIRONMENT === "development"
    ? `mongodb://localhost:27017/${process.env.DEVELOPMENT_MONGO_DB_NAME}`
    : `mongodb+srv://${process.env.PRODUCTION_MONGO_DB_USER_NAME}:${process.env.PRODUCTION_MONGO_DB_PASSWORD}@fitnesslogger.gbxbtbv.mongodb.net/${process.env.PRODUCTION_MONGO_DB_NAME}`;



mongoose
  .connect(BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4, // Force to use IPv4
  })
  .then(() => {
    console.log("DATABASE CONNECTION SUCCESSFULLY");
  })
  .catch((err) => {
    console.error("ERROR CONNECTING TO DATABASE:", err.message);
  });
