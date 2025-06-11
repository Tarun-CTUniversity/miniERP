const express = require("express");
const {
  createStudent,
  updateStudentData,
  getStudentProfile,
  softDeleteStudent,
} = require("../controller/studentController");

const router = express.Router();

// ----------- Student CRUD Routes -----------
router.post("/register", createStudent);                     // Full signup
router.put("/update/:userID", updateStudentData);               // Update all fields
router.get("/profile/:userID", getStudentProfile);          // Get student profile
router.delete("/delete/:userID", softDeleteStudent);        // Soft delete

module.exports = router;
