const mongoose = require("mongoose");

const studentSessionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  session: { type: String, required: true }, // e.g., "2024-25"

  // Academic Association
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  specialization: { type: mongoose.Schema.Types.ObjectId, ref: "Specialization" },

  // Class & Subject Info
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  section: { type: String },
  group: { type: String },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  mentor:{type: mongoose.Schema.Types.ObjectId, ref: "Teacher"}

}, { timestamps: true });

module.exports = mongoose.model("StudentSession", studentSessionSchema);
