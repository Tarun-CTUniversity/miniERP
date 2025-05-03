const mongoose = require("mongoose");
const departmentModel = require("../../database/models/SchoolModels/departmentModel");
const schoolModel = require("../../database/models/SchoolModels/schoolModel");
const programModel = require("../../database/models/SchoolModels/programModel");
const AppError = require("../../util/ErrorHandler");
const validateData = require("../../util/dataValidator");
const Specialization = require("../../database/models/SchoolModels/specializationModel");
const sessionModel = require("../../database/models/AcadmicModel/sessionModel");
const PROGRAM_TYPE = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

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
        const name = req.params.schoolName;
        console.log(name);
        const departments = await departmentModel.find().select("name _id session");

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

exports.updateDepartmentPrograms = async (req, res, next) => {
  try {
    const { session, school, department, existingPrograms, newPrograms } = req.body;
    

    // Step 1: Validate session, school, and department IDs
    if (!isValidObjectId(session) || !isValidObjectId(school) || !isValidObjectId(department)) {
      throw new AppError("Invalid ID formats for session, school, or department", 400);
    }

    const departmentData = await departmentModel.findById(department);

    if (!departmentData) {
      throw new AppError("Department not found", 404);
    }
    
    // Step 2: Validate uniqueness of program names and codes
    const allPrograms = [...existingPrograms, ...newPrograms];
    const nameSet = new Set();
    const codeSet = new Set();

    for (const program of allPrograms) {
      const normalizedName = program.name.trim().toUpperCase();
      const normalizedCode = program.code.trim().toUpperCase();

      if (nameSet.has(normalizedName)) {
        throw new AppError(`Duplicate program name found: ${program.name}`, 400);
      }
      if (codeSet.has(normalizedCode)) {
        throw new AppError(`Duplicate program code found: ${program.code}`, 400);
      }

      nameSet.add(normalizedName);
      codeSet.add(normalizedCode);
    }
    
    // Step 3: Update existing programs
    for (const program of existingPrograms) {
      if (!isValidObjectId(program.id)) {
        throw new AppError(`Invalid program ID: ${program.id}`, 400);
      }

      await programModel.findByIdAndUpdate(
        program.id,
        {
          name: program.name,
          code: program.code,
          degreeType: program.type,
          duration: program.duration,
          description: program.des || "",
          deleted: program.deleted || false,
          deletedAt: program.deleted ? new Date() : null,
          
        },
        { new: true, runValidators: true }
      );
    }
    
    // Step 4: Create new programs
    const newProgramPromises = newPrograms.map((program) =>
      programModel.create({
        name: program.name,
        code: program.code,
        degreeType: program.type,
        duration: program.duration,
        description: program.des || "",
        department,
        session,
        deleted: false,
      })
    );
   
    const createdPrograms = await Promise.all(newProgramPromises);
    
    // Step 5: Update department with new program IDs
    const newProgramIds = createdPrograms.map((program) => program._id);
    
    departmentData.programs = [...departmentData.programs, ...newProgramIds];
    await departmentData.save();

    // Step 6: Fetch updated programs
    const updatedDepartment = await departmentModel.findById(department).populate("programs");
    
    const sessions = await sessionModel
            .find()
            .populate({
              path: 'schools',
              populate: {
                path: 'departments',
                populate: {
                  path: 'programs',
                  populate: {
                    path: 'specializations',
                  },
                },
              },
            });
    res.status(200).json({
      success: true,
      message: "Department programs updated successfully",
      data: {
        programs:updatedDepartment.programs,
        sessions:sessions
      },
    });
  } catch (err) {
    next(err);
  }
};
