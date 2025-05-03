const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please give the name of Subject"],
    trim: true
  },
  code: {
    type: String,
    required: [true, "Please give subject Code"],
    trim: true
  },

  // Required references
  session: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please add session"],
    ref: "sessionModel"
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please give School ID"],
    ref: "School"
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please add the Department ID"],
    ref: "Department"
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please add the Program ID"],
    ref: "Programme"
  },
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialization"
  },

  // Relations
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }],
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class"
  }],
  courseFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseFile"
  },
  questionBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionBank"
  },

  // L-T-P structure
  L: { type: Number, default: 0 },
  T: { type: Number, default: 0 },
  P: { type: Number, default: 0 },

  semesterOffered: {
    type: Number
  },
  category: {
    type: String,
    enum: ['Core', 'Elective', 'Open Elective', 'Lab'],
    default: 'Core'
  },

  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}, { timestamps: true });

// Virtual: Credit (C)
subjectSchema.virtual('C').get(function () {
  return this.L + this.T + (this.P / 2);
});

// Virtual: Contact Hours (C * 15)
subjectSchema.virtual('contactHours').get(function () {
  return (this.L + this.T + (this.P / 2)) * 15;
});

module.exports = mongoose.model("Subject", subjectSchema);
