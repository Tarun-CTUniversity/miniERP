const express = require("express");
const {
  teacherLogin,
  teacherLogout,
} = require("../controller/teacherController");
const {
  studentLogin,
  studentLogout,
} = require("../controller/studentController");

const router = express.Router();

// ----------- Teacher Auth Routes -----------
router.post("/teacher/login", teacherLogin);
router.get("/teacher/logout", teacherLogout);


// ----------- Student Auth Routes -----------
router.post("/student/login", studentLogin);
router.get("/student/logout", studentLogout);



module.exports = router;