const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ---------- Teacher Main Schema ----------
const teacherSchema = new mongoose.Schema({

  // --- Personal Info ---
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  aadhar: { type: String, trim: true },
  ABCID: { type: String, trim: true },

  // --- Parental Info ---
  fatherName: { type: String, required: true, trim: true },
  motherName: { type: String, required: true, trim: true },
  fatherMobile: { type: String, required: true, trim: true },
  motherMobile: { type: String, trim: true },
  parentEmail: { type: String, required: true, trim: true },

  // --- Contact Info ---
  teacherMobile: { type: String, required: true, trim: true },
  teacherEmail: { type: String, required: true, trim: true },

  // --- Address Info ---
  localAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },

  // --- Employment Info ---
  teacherID: { type: String, required: true, unique: true },
  qualification: { type: String, trim: true, required: true },
  joiningDate: { type: Date, default: Date.now },

  // --- Session & School Info ---
  session: { type: String, required: true }, // e.g., "2024-25"
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },

  // --- Subjects & Classes Info ---
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  
  // --- Role Info ---
  roles: {
    type: [String],
    enum: ["teacher", "HOS", "HOD", "exam_coordinator"],
    default: ["teacher"]
  },

  // --- Authentication ---
  password: { type: String, required: true, select: false },

  // --- Status Info ---
  deleted: { type: Boolean, default: false }, // soft delete flag
  deletedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// Hash password before save
teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
teacherSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT
teacherSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.SECRET_KEY,
        { expiresIn: process.env.TOKEN_EXPIRY }
    );
};

module.exports = mongoose.model("Teacher", teacherSchema);
