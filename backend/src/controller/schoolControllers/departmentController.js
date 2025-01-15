const mongoose = require("mongoose");
const departmentModel = require("../../database/models/SchoolModels/departmentModel");
const schoolModel = require("../../database/models/SchoolModels/schoolModel");
const AppError = require("../../util/ErrorHandler");
const validateData = require("../../util/dataValidator");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// create Department
exports.createDepartment = async (req, res, next) => {
    try {
        validateData(req.body,departmentModel,["name", "departmentCode", "school","session"])
        const { name, departmentCode, school, description, session } = req.body;        

        const existingSchool = await schoolModel.findById(school);
        if (!existingSchool) {
            throw new AppError("Referenced School does not exist", 404);
        }

        const existingDept = await departmentModel.findOne({
            $or: [{ name: name.trim() }, { departmentCode: departmentCode.trim() }]
        });
        if (existingDept) {
            throw new AppError("Department with the same name or departmentCode already exists", 400);
        }

        const department = await departmentModel.create({
            name: name.trim(),
            departmentCode: departmentCode.trim(),
            school,
            description: description ? description.trim() : undefined,
            session
        });

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            department
        });
    } catch (err) {
        next(err);
    }
};

//  Update Description of a Department
exports.updateDescriptionOfDepartment = async (req, res, next) => {
    try {
        const { id, description } = req.body;

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Department ID format", 400);
        }
        validateData({description},departmentModel,["description"]);

        // Find and update the department
        const department = await departmentModel.findById(id);
        if (!department) {
            throw new AppError("Department not found", 404);
        }

        department.description = description.trim();
        await department.save();

        res.status(200).json({
            success: true,
            message: 'Department description updated successfully',
            department
        });
    } catch (err) {
        next(err);
    }
};

// Add Session to a Department
exports.addDepartmentSession = async (req, res, next) => {
    try {
        const { id, sessions } = req.body;

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Department ID format", 400);
        }

        validateData({session:sessions},departmentModel,["session"]);

        // Find the department
        const department = await departmentModel.findById(id);
        if (!department) {
            throw new AppError("Department not found", 404);
        }

        for(let session of sessions){
            // Check if session already exists
            if (department.session.includes(session.trim())) {
                throw new AppError("Session already exists for this department", 400);
            }
            // Add the new session
            department.session.push(session.trim());
        }

        await department.save();

        res.status(201).json({
            success: true,
            message: "Session added successfully",
            department
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 4. Get All Department Names with IDs
 */
exports.getAllDepartmentNames = async (req, res, next) => {
    try {
        const departments = await departmentModel.find().select("name _id session");

        if (departments.length === 0) {
            throw new AppError("No departments found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Department names retrieved successfully",
            data: departments
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 5. Get Specific Department Data by ID
 */
exports.getDepartmentData = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Department ID format", 400);
        }

        const department = await departmentModel.findById(id);

        if (!department) {
            throw new AppError("Department not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Department data retrieved successfully",
            data: department
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 6. Get Data of All Departments
 */
exports.getAllDepartmentData = async (req, res, next) => {
    try {
        const departments = await departmentModel.find().populate('school', 'name');

        if (departments.length === 0) {
            throw new AppError("No departments found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Departments data retrieved successfully",
            data: departments
        });
    } catch (err) {
        next(err);
    }
};
