const mongoose = require("mongoose");

const teacherSessionSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  session: { type: String, required: true }, // e.g., "2024-25"

  // --- Academic Info ---
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  // program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },

  // --- Subjects & Class Info ---
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  classIncharge: [{ type: mongoose.Schema.Types.ObjectId, ref: "ClassSection" }]

}, { timestamps: true });

// Ensure unique teacher-session pair
teacherSessionSchema.index({ teacher: 1, session: 1 }, { unique: true });

module.exports = mongoose.model("TeacherSession", teacherSessionSchema);
