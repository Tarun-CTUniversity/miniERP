const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({

  // 🎓 Basic Class Info
  name: { type: String, required: [true, "Please provide the name of the class"], trim: true },
  section: { type: String, trim: true },
  semester: { type: Number, trim: true },
  strenth:{type:Number , trim:true},

  // 📚 Academic Structure
  session: { type: mongoose.Schema.Types.ObjectId, ref: "sessionModel", required: true },
  school: [{ type: mongoose.Schema.Types.ObjectId, ref: "School", required: true }],
  department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department"}],
  program: [{ type: mongoose.Schema.Types.ObjectId, ref: "Programme"}],

  // 👨‍🏫 Mentor
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },

  // 📄 Academic Relationships
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }],
  examPapers: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExamPaper" }],

  // 📅 Metadata & Soft Delete
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
  
}, { timestamps: true });


// 🔁 Virtual Fields
classSchema.virtual('studentCount').get(function () {
  return this.students?.length || 0;
});

classSchema.virtual('subjectCount').get(function () {
  return this.subjects?.length || 0;
});

classSchema.set('toJSON', { virtuals: true });
classSchema.set('toObject', { virtuals: true });

// 🔍 Static Methods
classSchema.statics.findActive = function (filter = {}) {
  return this.find({ deleted: false, ...filter });
};

module.exports = mongoose.model("ClassSection", classSchema);
