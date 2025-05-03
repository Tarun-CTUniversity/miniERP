const mongoose = require("mongoose");

const studentResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  session: {
    type: String, // e.g., "2024-25"
    required: true
  },

  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },

  examType: {
    type: String,
    enum: ["midterm", "internal", "final", "practical", "assignment"],
    required: true
  },

  subjects: [
    {
      subjectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
      },

      // Redundant historical fields to avoid future populating
      subjectName: {
        type: String,
        required: true
      },
      subjectCode: {
        type: String,
        required: true
      },

      // Academic Performance
      marksObtained: {
        type: Number,
      },
      totalMarks: {
        type: Number,
      },
      grade: {
        type: String,
        required: true
      },
      gradePoint: {
        type: Number,
        required: true
      },
      credit: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ["PASS", "RE"],
        required: true
      },
    }
  ],

  // Overall performance
  percentage: {
    type: Number,
    required: true
  },
  SGPA: {
    type: Number,
    required: true
  },
  overallStatus: {
    type: String,
    enum: ["PASS", "RE"],
    required: true
  },

  remarks: {
    type: String
  },

  isFinalized: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("StudentResult", studentResultSchema);
