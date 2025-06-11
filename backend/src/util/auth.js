const jwt = require("jsonwebtoken");
const AppError = require("./ErrorHandler");
const Teacher = require("../database/models/UsersModel/teacherModel");
const Student = require("../database/models/UsersModel/studentModel");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new AppError("Please login first", 400);
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { id, userType } = decoded;

    if (!id || !userType) {
      throw new AppError("Invalid token", 400);
    }

    let user;
    if (userType === "teacher") {
      user = await Teacher.findById(id);
    } else if (userType === "student") {
      user = await Student.findById(id);
    } else {
      throw new AppError("Unknown user type", 400);
    }

    if (!user) {
      throw new AppError("User not found or inactive", 404);
    }

    res.user = user;
    next();

  } catch (err) {
    next(err);
  }
};


exports.isAuthorized = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        throw new AppError("Please login first", 400);
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const { id, userType } = decoded;

      if (!id || !userType) {
        throw new AppError("Invalid token", 400);
      }

      let user;
      if (userType === "teacher") {
        user = await Teacher.findById(id);
      } else if (userType === "student") {
        user = await Student.findById(id);
      } else {
        throw new AppError("Unknown user type", 400);
      }

      if (!user) {
        throw new AppError(`${userType} not found or inactive`, 404);
      }

      // Check if user has at least one allowed role
      const hasRole = user.roles.some(role => allowedRoles.includes(role));
      if (!hasRole) {
        throw new AppError("Unauthorized role", 403);
      }

      // Attach user to response for later middleware/controllers
      res.user = user;
      next();

    } catch (err) {
      next(err);
    }
  };
};
