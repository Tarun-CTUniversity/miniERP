const mongoose = require("mongoose");

const teacherSessionSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  session: { type: String, required: true }, // e.g., "2024-25"

  // School and Department Info
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  specialization: { type: mongoose.Schema.Types.ObjectId, ref: "Specialization" },

  // Subjects and Classes
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  
  // Classes Incharge Info
  classIncharge: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],

}, { timestamps: true });

module.exports = mongoose.model("TeacherSession", teacherSessionSchema);
