const schoolModel = require("../../database/models/SchoolModels/schoolModel");
const validateData = require("../../util/dataValidator");
const AppError = require("../../util/ErrorHandler");
const mongoose = require("mongoose");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const checkSchoolID = (id)=>{
    if (!isValidObjectId(id)) {
        throw new AppError("Invalid School ID format", 400);
    }
}

// Helper function to check if a school exists by ID
const findSchoolById = async (id) => {
    checkSchoolID(id);
    const school = await schoolModel.findById(id);
    if (!school) {
        throw new AppError("School not found", 404);
    }
    return school;
};

// Create School
exports.createSchool = async (req, res, next) => {
    try {
        validateData(req.body , schoolModel,["name","session"]);

        const { name, description, session } = req.body;

        const existingSchool = await schoolModel.findOne({ "name":name.trim() });

        if (existingSchool) {
            throw new AppError("School name already exists", 400);
        }

        const school = await schoolModel.create({ "name":name.trim(), description, session });
        

        res.status(201).json({
            success: true,
            message: `${school.name} has been created successfully`,
            data: school
        });
    } catch (err) {
        next(err);
    }
};

// Update School Description
exports.updateDescriptionOfSchool = async (req, res, next) => {
    try {

        const { id, description } = req.body;

        checkSchoolID(id);
        validateData({description} , schoolModel , ["description"]);

        const school = await schoolModel.findByIdAndUpdate(
            id, 
            { description }, 
            { new: true, runValidators: true }
        );

        if (!school) {
            throw new AppError("School not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Description updated successfully",
            data: school
        });
    } catch (err) {
        next(err);
    }
};

// Get All School Names with IDs
exports.getAllSchoolNames = async (req, res, next) => {
    try {
        const schools = await schoolModel.find().select("name _id session");
        if (schools.length === 0) {
            throw new AppError("No schools found", 404);
        }

        res.status(200).json({
            success: true,
            message: "School names retrieved successfully",
            data: schools
        });
    } catch (err) {
        next(err);
    }
};

// Get Specific School Data by ID
exports.getSchoolData = async (req, res, next) => {
    try {
        const { id } = req.params;
        checkSchoolID(id);
        const school = await schoolModel.findById(id).populate("departments session");

        res.status(200).json({
            success: true,
            message: "School data retrieved successfully",
            data: school
        });
    } catch (err) {
        next(err);
    }
};

// Get Data of All Schools
exports.getAllSchoolData = async (req, res, next) => {
    try {
        const schools = await schoolModel.find();

        if (schools.length === 0) {
            throw new AppError("No schools found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Schools data retrieved successfully",
            data: schools
        });
    } catch (err) {
        next(err);
    }
};


