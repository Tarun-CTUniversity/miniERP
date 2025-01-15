const express = require("express");
const { teacherLogin, teacherLogout } = require("../controller/teacherController");

const router = express.Router();

router.route("/teacherLogin").post(teacherLogin).get(teacherLogout);

module.exports = router;