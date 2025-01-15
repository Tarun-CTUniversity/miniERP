const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
dotenv.config({path:"./config/config.env"});


module.exports = app;