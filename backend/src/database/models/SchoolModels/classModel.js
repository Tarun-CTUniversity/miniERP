const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please give name of the class"],
    trim: true,
  },
  section: {
    type: String,
    trim: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Session is required"],
    ref: "sessionModel"
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "School is required"],
    ref: "School"
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Department is required"],
    ref: "Department"
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Program is required"],
    ref: "Programme"
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  },
  specialization: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialization"
  }],
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }],
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Result"
  }],
  examPapers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamPaper"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Virtuals
classSchema.virtual('studentCount').get(function () {
  return this.students?.length || 0;
});
classSchema.virtual('subjectCount').get(function () {
  return this.subjects?.length || 0;
});

classSchema.set('toJSON', { virtuals: true });
classSchema.set('toObject', { virtuals: true });

// Static method to filter soft-deleted
classSchema.statics.findActive = function (filter = {}) {
  return this.find({ deleted: false, ...filter });
};

module.exports = mongoose.model("Class", classSchema);
