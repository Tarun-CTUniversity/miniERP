const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ---------- Student Main Schema ----------
const studentSchema = new mongoose.Schema({

  // --- Personal Info ---
  name: { type: String, required: true, trim: true },
  UID:{type: String, required: true, trim: true},
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  aadhar: { type: String, trim: true },
  ABCID: { type: String, trim: true },

  // --- Parental Info ---
  fatherName: { type: String, required: true, trim: true },
  motherName: { type: String, required: true, trim: true },
  fatherMobile: { type: String, required: true, trim: true },
  motherMobile: { type: String, trim: true },
  parentEmail: { type: String, trim: true },

  // --- Contact Info ---
  studentMobile: { type: String, required: true, trim: true },
  studentEmail: { type: String, required: true, trim: true },

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


  results: [
    {
      session: {
        type: String, // e.g., "2024-25"
        required: true
      },
      result: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentResult"
      }
    }
  ],

  // --- Residency & Transport ---
  residencyStatus: {
    type: String,
    enum: ["day_scholar", "hosteler"],
    required: true
  },
  usesUniversityBus: { type: Boolean, default: false },

  // --- Authentication ---
  password: { type: String, required: true, select: false },

  // --- Other Info ---
  deleted: { type: Boolean, default: false }, // soft delete flag
}, {
  timestamps: true
});

// ---------- Password Hashing ----------
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ---------- Password Compare ----------
studentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
