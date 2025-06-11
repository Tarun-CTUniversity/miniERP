const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ---------- Student Schema ----------
const studentSchema = new mongoose.Schema({

  // --- Personal Info ---
  name: { type: String, required: true, trim: true },
  userID: { type: String, required: true, trim: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  aadhar: { type: String, trim: true },
  ABCID: { type: String, trim: true },

  // --- Parental Info ---
  fatherName: { type: String, required: true, trim: true },
  motherName: { type: String, required: true, trim: true },
  fatherMobile: {
    countryCode: { type: String, required: true }, // e.g., "+91"
    number: { type: String, required: true, trim: true }
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
  studentMobile: {
    countryCode: { type: String, required: true },
    number: { type: String, required: true, trim: true }
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid student email format"]
  },

  // --- Address Info ---
  localAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },

  // --- Admission Info ---
  admissionNumber: { type: String, required: true, unique: true },
  registrationDate: { type: Date, default: Date.now },
  entryType: { type: String, enum: ["regular", "lateral", "transfer"], default: "regular" },
  admissionCategory: { type: String, enum: ["PMS", "NON PMS"], required: true },

  // --Session Info
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudentSession" }],

  // --- Results ---
  results: [
    {
      session: { type: String, required: true }, // e.g., "2024-25"
      result: { type: mongoose.Schema.Types.ObjectId, ref: "StudentResult" }
    }
  ],

  // --- Residency & Transport ---
  residencyStatus: {
    type: String,
    enum: ["day_scholar", "hosteler"],
    required: true
  },
  usesUniversityBus: { type: Boolean, default: false },

  // --- Profile Image (local path) ---
  profileImage: { type: String, trim: true }, // e.g., /uploads/students/photo123.jpg

  // --- Role Info ---
  roles: {
    type: [String],
    enum: ["student", "CR"],
    default: ["student"]
  },

  // --- Authentication ---
  password: { type: String, required: true, select: false,minLength:6 },

  // --- Soft Delete ---
  deleted: { type: Boolean, default: false }

}, { timestamps: true });


// ---------- Virtual Field: Age ----------
studentSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const ageDiffMs = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(ageDiffMs / (1000 * 60 * 60 * 24 * 365.25));
});

// Enable virtuals in JSON and Object outputs
studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

// ---------- Password Hashing Before Save ----------
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ---------- Compare Password ----------
studentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.roles, userType: "student" },
    process.env.SECRET_KEY,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
};


module.exports = mongoose.model("Student", studentSchema);
