const sessionModel = require("../../database/models/AcadmicModel/sessionModel");
const schoolModel = require("../../database/models/SchoolModels/schoolModel");
const validateData = require("../../util/dataValidator");
const AppError = require("../../util/ErrorHandler");
const mongoose = require("mongoose");
const VALID_SEMESTERS = ['Jan-June', 'Sep-Dec'];

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const checkSessionID = (id) => {
    if (!isValidObjectId(id)) {
        throw new AppError("Invalid Session ID format", 400);
    }
};

// Helper function to check if a session exists by ID
const findSessionById = async (id) => {
    checkSessionID(id);
    const session = await sessionModel.findById(id);
    if (!session) {
        throw new AppError("Session not found", 404);
    }
    return session;
};

// Create a new session => Will create Session with all valid School names
exports.createSession = async (req, res, next) => {
    try {
      const { name, schools } = req.body;
      
      if (!name) {
        throw new AppError("Session name is required", 400);
      }
      
      // Check if session exists
      const existingSession = await sessionModel.findOne({ name: name.trim() });
      if (existingSession) {
        throw new AppError("Session name already exists", 400);
      }
      
      // Validate name format
      const nameParts = name.split(',');
      if (nameParts.length !== 2) {
        throw new AppError('Session name should be in the format "year,semester"', 400);
      }
      
      const [year, semester] = nameParts.map(part => part.trim());
      
      // Validate year
      if (!/^\d{4}$/.test(year)) {
        throw new AppError('Year should be a 4-digit number', 400);
      }
      
      // Validate semester
      if (!VALID_SEMESTERS.includes(semester)) {
        throw new AppError('Semester should be either "Jan-June" or "Sep-Dec"', 400);
      }
      
      // Create session first
      const session = await sessionModel.create({ name: name.trim() });
      
      // Process schools properly
      const schoolIds = [];
      const createdSchool = new Set();
      const createdCode = new Set();
      
      if (Array.isArray(schools) && schools.length > 0) {
        // Using Promise.all to handle all school creations concurrently
        const schoolPromises = schools.map(async (school) => {
          if (
            school.name && 
            school.code && 
            !createdSchool.has(school.name.trim().toUpperCase()) && 
            !createdCode.has(school.code.trim().toUpperCase())
          ) {
            const schoolData = await schoolModel.create({
              name: school.name.trim().toUpperCase(),
              code: school.code.trim().toUpperCase(),
              description: school.des,
              session: session._id  // Use _id here
            });
            
            schoolIds.push(schoolData._id);  // Push the _id from the created document
            createdSchool.add(school.name.trim().toUpperCase());
            createdCode.add(school.code.trim().toUpperCase());
          }
        });
        
        await Promise.all(schoolPromises);
      }
      
      // Update the session with the school IDs
      if (schoolIds.length > 0) {
        session.schools = schoolIds;
        await session.save();
      }
    
      // Fetch the updated session with populated schools
      const populatedSession = await sessionModel.findById(session._id).populate('schools', 'code description name'); 
      
      res.status(201).json({
        success: true,
        message: `${populatedSession.name} has been created successfully`,
        data: populatedSession
      });
      
    } catch (err) {
      next(err);
    }
};
// Add a school to a session
exports.addSchool = async (req, res, next) => {
    try {
        const { sessionId, schoolId } = req.body;

        checkSessionID(sessionId);
        checkSessionID(schoolId);

        const session = await findSessionById(sessionId);

        if (!session.schools.includes(schoolId)) {
            session.schools.push(schoolId);
            await session.save();
        }

        res.status(200).json({
            success: true,
            message: "School added to session successfully",
            data: session
        });
    } catch (err) {
        next(err);
    }
};

// Update session name
exports.updateSessionName = async (req, res, next) => {
    try {
        const { sessionId, name } = req.body;

        checkSessionID(sessionId);
        validateData({ name }, sessionModel, ["name"]);

        const session = await sessionModel.findByIdAndUpdate(
            sessionId,
            { name: name.trim() },
            { new: true, runValidators: true }
        );

        if (!session) {
            throw new AppError("Session not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Session name updated successfully",
            data: session
        });
    } catch (err) {
        next(err);
    }
};

// Get all session names with IDs
exports.getSessionNames = async (req, res, next) => {
    try {
        const sessions = await sessionModel.find().select("name -_id");

        if (sessions.length === 0) {
            throw new AppError("No sessions found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Session names retrieved successfully",
            data: Array.isArray(sessions) ? sessions : [sessions]  // This ensures it's always an array
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllSessionData = async (req, res, next) => {
    try {
        const sessions = await sessionModel.find().populate('schools');

        if (sessions.length === 0) {
            throw new AppError("No sessions found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Session names retrieved successfully",
            data: sessions
        });
    } catch (err) {
        next(err);
    }
};
// Get session data by name
exports.getSessionDataByName = async (req, res, next) => {
    try {
        const { name } = req.params;

        const session = await sessionModel.findOne({ name: name.trim() }).populate("schools" , "name");

        if (!session) {
            throw new AppError("Session not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Session data retrieved successfully",
            data: session
        });
    } catch (err) {
        next(err);
    }
};

// Get session data by ID
exports.getSessionDataByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        checkSessionID(id);
        const session = await sessionModel.findById(id).populate("schools");

        res.status(200).json({
            success: true,
            message: "Session data retrieved successfully",
            data: session
        });
    } catch (err) {
        next(err);
    }
};
