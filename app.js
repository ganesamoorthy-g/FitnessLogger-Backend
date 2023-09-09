const express = require('express');
const APP_SERVER = express();

// REGISTER ALL THE CONTROLLER IN APP SERVER

APP_SERVER.use("/users", require("./Controllers/Users.controller"));
APP_SERVER.use("/auth", require("./Controllers/Auth.controller"));
APP_SERVER.use("/cardio", require("./Controllers/Cardio.controller"));
APP_SERVER.use("/resistance", require("./Controllers/Resistance.controller"));
APP_SERVER.use("/aerobic", require("./Controllers/Aerobic.controller"));


module.exports = APP_SERVER;