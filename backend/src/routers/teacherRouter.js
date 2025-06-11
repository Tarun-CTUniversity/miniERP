const express = require("express");
const {
  createTeacher,
  updateTeacherData,
  getTeacherProfile,
  softDeleteTeacher
} = require("../controller/teacherController");

const { isAuthorized } = require("../util/auth");
const router = express.Router();



// ----------- CRUD Routes -----------
router.post("/register", createTeacher);      // Sign up with limited fields
router.put("/update/:userID", updateTeacherData); // Update personal/contact info
router.get("/profile/:userID", getTeacherProfile); // Get profile by userID
router.delete("/delete/:userID", softDeleteTeacher); // Soft delete



module.exports = router;