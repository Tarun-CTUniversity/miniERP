const Student = require("../database/models/UsersModel/studentModel");
const AppError = require("../util/ErrorHandler");
const { sendToken } = require("../util/sendToken");

// Get all fields dynamically from schema paths for create/update filtering
const allFields = Object.keys(Student.schema.paths).filter(
  (field) => !["_id", "__v", "deletedAt"].includes(field)
);

// Utility to filter allowed fields from request body
function filterFields(body, allowedFields) {
  const filtered = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) filtered[key] = body[key];
  }
  return filtered;
}

// Create new student (sign up)
exports.createStudent = async (req, res, next) => {
  try {
    const filteredBody = filterFields(req.body, allFields);

    // Check if userID or admissionNumber already exists
    const existingStudent = await Student.findOne({
      $or: [
        { userID: filteredBody.userID },
        { admissionNumber: filteredBody.admissionNumber },
      ],
    });
    if (existingStudent) {
      return next(new AppError("User with given ID or Admission Number already exists", 400));
    }

    const student = await Student.create(filteredBody);
    if (!student) {
      return next(new AppError("Student can't be created", 400));
    }

    await sendToken(student, res, next);
  } catch (err) {
    next(err);
  }
};

// Student login
exports.studentLogin = async (req, res, next) => {
  try {
    const { userID, password } = req.body;

    const user = await Student.findOne({ userID }).select("+password");
    if (!user) {
      return next(new AppError("Wrong User ID or password", 400));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Wrong User ID or password", 400));
    }

    await sendToken(user, res, next);
  } catch (err) {
    next(err);
  }
};

// Student logout
exports.studentLogout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", { maxAge: 0, httpOnly: true })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (err) {
    next(err);
  }
};

// Get all students (exclude soft deleted)
exports.getStudentsAllData = async (req, res, next) => {
  try {
    const users = await Student.find({ deleted: false });
    if (!users) {
      return next(new AppError("Students data not found", 404));
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Update student data (all fields allowed)
exports.updateStudentData = async (req, res, next) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      return next(new AppError("UserID is required for update", 400));
    }

    const updateData = filterFields(req.body, allFields);

    const updatedStudent = await Student.findOneAndUpdate(
      { userID, deleted: false },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return next(new AppError("Student not found or deleted", 404));
    }

    res.status(200).json({
      success: true,
      message: "Student data updated successfully",
      data: updatedStudent,
    });
  } catch (err) {
    next(err);
  }
};

// Soft delete student
exports.softDeleteStudent = async (req, res, next) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      return next(new AppError("UserID is required for deletion", 400));
    }

    const student = await Student.findOneAndUpdate(
      { userID, deleted: false },
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!student) {
      return next(new AppError("Student not found or already deleted", 404));
    }

    res.status(200).json({
      success: true,
      message: "Student soft deleted successfully",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// Update student roles (admin only)
exports.updateStudentRole = async (req, res, next) => {
  try {
    const { userID, roles } = req.body;
    if (!userID || !roles || !Array.isArray(roles)) {
      return next(new AppError("userID and roles array are required", 400));
    }

    // Optional: validate roles before update

    const updatedStudent = await Student.findOneAndUpdate(
      { userID, deleted: false },
      { roles },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return next(new AppError("Student not found or deleted", 404));
    }

    res.status(200).json({
      success: true,
      message: "Student roles updated successfully",
      data: updatedStudent,
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return res.status(400).json({ message: "userID is required" });
    }

    // Find the student by userID and ensure they are not soft deleted
    const student = await Student.findOne({ userID, deleted: false })
      .populate("sessions")   // populate session details if needed
      .populate("results.result") // populate result data if needed
      .select("-password");   // exclude password from the response

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};