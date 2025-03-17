const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require('cors')
app.use(express.json());
app.use(cookieParser());
app.use(cors());
dotenv.config({path:"./config/config.env"});


module.exports = app;