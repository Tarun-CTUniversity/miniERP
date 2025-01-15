const departmentModel = require("../../database/models/SchoolModels/departmentModel");
const programModel = require("../../database/models/SchoolModels/programModel");
const validateData = require("../../util/dataValidator");
const AppError = require("../../util/ErrorHandler");
const mongoose = require("mongoose");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new Program
exports.createProgram = async (req, res, next) => {
    try {
        validateData(req.body,programModel,["name" , "department" , "programmeCode","degreeType","duration", "session"])
        const { name, department, programmeCode, degreeType, duration, description, session } = req.body;

        const dep = await departmentModel.findById(department);
        if(!dep){
            throw new AppError("No deparment exist with this ID", 404);
        }

        const programExists = await programModel.findOne({
            $or: [{"name":name.trim()} , {"programmeCode":programmeCode.trim()}]});
        if (programExists) {
            throw new AppError("Program name already exists", 400);
        }

        const program = await programModel.create({ name, department, programmeCode, degreeType, duration, description, session });

        res.status(201).json({
            success: true,
            message: `Program ${program.name} created successfully`,
            data: program
        });
    } catch (err) {
        next(err);
    }
};

// Update Program Description
exports.updateProgramDescription = async (req, res, next) => {
    try {
        const { id, description } = req.body;

        validateData({description},programModel,["description"])

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Program ID format", 400);
        }

        const program = await programModel.findByIdAndUpdate(
            id,
            { description },
            { new: true, runValidators: true }
        );

        if (!program) {
            throw new AppError("Program not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Program description updated successfully",
            data: program
        });
    } catch (err) {
        next(err);
    }
};

// Add Session to Program
exports.addProgramSession = async (req, res, next) => {
    try {
        const { id, sessions } = req.body;

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Program ID format", 400);
        }

        validateData({session:sessions} , programModel , ["session"]);
        
        const program = await programModel.findById(id);
        if (!program) {
            throw new AppError("Program not found", 404);
        }

        for(let session of sessions){
            if (program.session.includes(session.trim())) {
                throw new AppError("Session already exists for this program", 400);
            }
    
            program.session.push(session.trim());
        }
        await program.save();

        res.status(201).json({
            success: true,
            message: "Session added successfully",
            data: program
        });
    } catch (err) {
        next(err);
    }
};

// Get All Program Names
exports.getAllProgramNames = async (req, res, next) => {
    try {
        const programs = await programModel.find().select("name _id");
        if (programs.length === 0) {
            throw new AppError("No programs found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Program names retrieved successfully",
            data: programs
        });
    } catch (err) {
        next(err);
    }
};

// Get Program Data by ID
exports.getProgramData = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Program ID is required", 400);
        }

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Program ID format", 400);
        }

        const program = await programModel.findById(id);
        if (!program) {
            throw new AppError("Program not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Program data retrieved successfully",
            data: program
        });
    } catch (err) {
        next(err);
    }
};

// Get All Program Data
exports.getAllProgramData = async (req, res, next) => {
    try {
        const programs = await programModel.find();

        if (programs.length === 0) {
            throw new AppError("No programs found", 404);
        }

        res.status(200).json({
            success: true,
            message: "All programs retrieved successfully",
            data: programs
        });
    } catch (err) {
        next(err);
    }
};
