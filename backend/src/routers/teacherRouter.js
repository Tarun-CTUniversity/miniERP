const express = require("express");
const { createTeacher, getTeachersAllData } = require("../controller/teacherController");
const { isAuthorized } = require("../util/auth");
const router = express.Router();



router.route("/getAllData").get(isAuthorized("superAdmin"),getTeachersAllData);

router.route("/").post(createTeacher);



module.exports = router;