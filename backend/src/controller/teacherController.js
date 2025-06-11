const Teacher = require("../database/models/UsersModel/teacherModel");
const AppError = require("../util/ErrorHandler");
const { sendToken } = require("../util/sendToken");

// Allowed fields for creation and update
const allowedCreateFields = [
  "userID",
  "name",
  "gender",
  "teacherEmail",
  "teacherMobile",
  "password",
  "dateOfBirth",
];

const allowedUpdateFields = [
  "name",
  "gender",
  "dateOfBirth",
  "aadhar",
  "maritalStatus",
  "fatherName",
  "motherName",
  "fatherMobile",
  "motherMobile",
  "parentEmail",
  "teacherMobile",
  "teacherEmail",
  "localAddress",
  "permanentAddress",
  "city",
  "state",
  "country",
  "pincode",
  "qualification",
  "photo",
];

// Utility function to filter allowed fields from request body
function filterFields(body, allowedFields) {
  const filtered = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) filtered[key] = body[key];
  }
  return filtered;
}

// Create a new teacher (Sign Up)
exports.createTeacher = async (req, res, next) => {
  try {
    const filteredBody = filterFields(req.body, allowedCreateFields);

    // Check if userID exists already
    const existingTeacher = await Teacher.findOne({ userID: filteredBody.userID });
    if (existingTeacher) {
      return next(new AppError("User already exists", 400));
    }

    const teacher = await Teacher.create(filteredBody);
    if (!teacher) {
      return next(new AppError("User can't be created", 400));
    }

    await sendToken(teacher, res, next);
  } catch (err) {
    next(err);
  }
};

// Teacher login
exports.teacherLogin = async (req, res, next) => {
  try {
    const { userID, password } = req.body;

    const user = await Teacher.findOne({ userID }).select("+password");
    if (!user) {
      return next(new AppError("Wrong User ID or password", 400));
    }

    const isMatch = await user.compare(password);
    if (!isMatch) {
      return next(new AppError("Wrong User ID or password", 400));
    }

    await sendToken(user, res, next);
  } catch (err) {
    next(err);
  }
};

// Teacher logout
exports.teacherLogout = async (req, res, next) => {
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

// Get all teacher data (optionally exclude soft deleted)
exports.getTeachersAllData = async (req, res, next) => {
  try {
    // Exclude soft deleted teachers by default
    const users = await Teacher.find({ deleted: false });
    if (!users) {
      return next(new AppError("Teachers data not found", 404));
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Update teacher data (profile updates)
exports.updateTeacherData = async (req, res, next) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      return next(new AppError("UserID is required for update", 400));
    }

    const updateData = filterFields(req.body, allowedUpdateFields);

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { userID, deleted: false },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTeacher) {
      return next(new AppError("User not found or deleted", 404));
    }

    res.status(200).json({
      success: true,
      message: "Teacher data updated successfully",
      data: updatedTeacher,
    });
  } catch (err) {
    next(err);
  }
};

// Soft delete teacher
exports.softDeleteTeacher = async (req, res, next) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      return next(new AppError("UserID is required for deletion", 400));
    }

    const teacher = await Teacher.findOneAndUpdate(
      { userID, deleted: false },
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!teacher) {
      return next(new AppError("User not found or already deleted", 404));
    }

    res.status(200).json({
      success: true,
      message: "Teacher soft deleted successfully",
      data: teacher,
    });
  } catch (err) {
    next(err);
  }
};

// Update teacher roles (admin only)
exports.updateTeacherRole = async (req, res, next) => {
  try {
    const { userID, roles } = req.body;
    if (!userID || !roles || !Array.isArray(roles)) {
      return next(new AppError("userID and roles array are required", 400));
    }

    // Validate roles before update if needed

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { userID, deleted: false },
      { roles },
      { new: true, runValidators: true }
    );

    if (!updatedTeacher) {
      return next(new AppError("User not found or deleted", 404));
    }

    res.status(200).json({
      success: true,
      message: "Teacher roles updated successfully",
      data: updatedTeacher,
    });
  } catch (err) {
    next(err);
  }
};


exports.getTeacherProfile = async (req, res, next) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return next(new AppError("User ID is required", 400));
    }

    const teacher = await Teacher.findOne({ userID, deleted: false }).select(
      "-password -__v -deleted"
    );

    if (!teacher) {
      return next(new AppError("Teacher not found", 404));
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};
