const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ---------- Teacher Main Schema ----------
const teacherSchema = new mongoose.Schema({

  // --- Personal Info ---
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  aadhar: { type: String, trim: true },
  maritalStatus: { type: String, enum: ["Married", "Single"] },

  // --- Parental Info ---
  fatherName: { type: String, trim: true },
  motherName: { type: String, trim: true },
  fatherMobile: {
    countryCode: { type: String },
    number: { type: String, trim: true }
  },
  motherMobile: {
    countryCode: { type: String },
    number: { type: String, trim: true }
  },
  parentEmail: {
    type: String,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid parent email format"]
  },

  // --- Contact Info ---
  teacherMobile: {
    countryCode: { type: String, required: true },
    number: { type: String, required: true, trim: true }
  },
  teacherEmail: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid teacher email format"]
  },

  // --- Address Info ---
  localAddress: { type: String },
  permanentAddress: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },

  // --- Employment Info ---
  teacherID: { type: String, required: true, unique: true },
  qualification: { type: String, trim: true, required: true },
  joiningDate: { type: Date },

  // --- Role Info ---
  roles: {
    type: [String],
    enum: ["teacher", "HOS", "HOD", "exam_coordinator"],
    default: ["teacher"]
  },

  // --- Authentication ---
  password: { type: String, required: true, select: false },

  // --- Status Info ---
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }

}, { timestamps: true });

// ---------- Virtual Populate: TeacherSessions ----------
teacherSchema.virtual("sessions", {
  ref: "TeacherSession",
  localField: "_id",
  foreignField: "teacher"
});

teacherSchema.set("toJSON", { virtuals: true });
teacherSchema.set("toObject", { virtuals: true });

// ---------- Password Hashing Before Save ----------
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ---------- Compare Password ----------
teacherSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ---------- Generate JWT Token ----------
teacherSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.roles },
    process.env.SECRET_KEY,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
};

module.exports = mongoose.model("Teacher", teacherSchema);
