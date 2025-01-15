const sessionModel = require("../../database/models/AcadmicModel/sessionModel")
const validateData = require("../../util/dataValidator");
const AppError = require("../../util/ErrorHandler");
const mongoose = require("mongoose");

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

// Create a new session
exports.createSession = async (req, res, next) => {
    try {
        validateData(req.body, sessionModel, ["name","schools"]);

        const { name , schools } = req.body;

        const existingSession = await sessionModel.findOne({ name: name.trim() });
        console.log(existingSession);
        if (existingSession) {
            throw new AppError("Session name already exists", 400);
        }

        const session = await sessionModel.create({ name: name.trim() , schools });

        res.status(201).json({
            success: true,
            message: `${session.name} has been created successfully`,
            data: session
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
        const sessions = await sessionModel.find().select("name _id");

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

        const session = await sessionModel.findOne({ name: name.trim() }).populate("schools");

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
