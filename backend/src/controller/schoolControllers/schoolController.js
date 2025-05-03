const sessionModel = require("../../database/models/AcadmicModel/sessionModel");
const schoolModel = require("../../database/models/SchoolModels/schoolModel");
const departmentModel = require("../../database/models/SchoolModels/departmentModel");
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


// Get All Departments of a School
exports.getAllDepartmentOfSchool = async (req, res, next) => {
    try {
        const { schoolInfo } = req.params;
        const [session, schoolName] = schoolInfo.split("_");
       
        if (!session || !schoolName) {
            throw new AppError("Invalid school information format", 400);
        }
        const sessionData  = await sessionModel.findOne({ name: session });
        if (!sessionData) {
            throw new AppError("Session not found", 404);
        }

        const school = await schoolModel.findOne({ name: schoolName, session:sessionData._id }).populate("departments");

        if (!school) {
            throw new AppError("School not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Departments retrieved successfully",
            data: school.departments
        });
    } catch (err) {
        next(err);
    }
};

exports.updateSchoolDepartments = async (req, res, next) => {
    const { school, session, existingDepartments, newDepartments } = req.body;
  
    try {
      // Step 1: Validate session and school
      const sessionData = await sessionModel.findOne({ name: session.trim() });
      if (!sessionData) {
        throw new AppError("Session not found", 404);
      }
  
      const schoolData = await schoolModel
        .findOne({ name: school.trim(), session: sessionData._id })
        .populate("departments");
      
        if (!schoolData) {
        throw new AppError("School not found", 404);
      }
  
      // Step 2: Validate and process existing departments
      const nameSet = new Set();
      const codeSet = new Set();
  
      for (const department of existingDepartments) {
        const departmentName = department.name?.trim().toUpperCase();
        const departmentCode = department.code?.trim().toUpperCase();
  
        if (!departmentName || !departmentCode) {
          throw new AppError("Each existing department must have a name and code", 400);
        }
  
        // Check for duplicates within the request
        if (nameSet.has(departmentName)) {
          throw new AppError(`Duplicate department name in request: ${departmentName}`, 400);
        }
        if (codeSet.has(departmentCode)) {
          throw new AppError(`Duplicate department code in request: ${departmentCode}`, 400);
        }
  
        nameSet.add(departmentName);
        codeSet.add(departmentCode);
        
        // Check for duplicates in the database
        const existingName = await departmentModel.findOne({
          name: departmentName,
          school: schoolData._id,
        });
        const existingCode = await departmentModel.findOne({
          code: departmentCode,
          school: schoolData._id,
        });
  
        if (existingName && existingName._id.toString() !== department.id) {
          throw new AppError(
            `Department with this name already exists in the database: ${departmentName}`,
            400
          );
        }
        if (existingCode && existingCode._id.toString() !== department.id) {
          throw new AppError(
            `Department with this code already exists in the database: ${departmentCode}`,
            400
          );
        }
  
        // Update the existing department
        await departmentModel.findOneAndUpdate(
          { name: departmentName, school: schoolData._id },
          {
            name: departmentName,
            code: departmentCode,
            description: department.description || "",
            deleted: department.deleted || false,
          },
          { new: true, runValidators: true }
        );
      }
  
      // Step 3: Validate and process new departments
      const newDepartmentPromises = [];
      for (const department of newDepartments) {
        const departmentName = department.name?.trim().toUpperCase();
        const departmentCode = department.code?.trim().toUpperCase();
  
        if (!departmentName || !departmentCode) {
          throw new AppError("Each new department must have a name and code", 400);
        }
  
        // Check for duplicates within the request
        if (nameSet.has(departmentName)) {
          throw new AppError(`Duplicate department name in request: ${departmentName}`, 400);
        }
        if (codeSet.has(departmentCode)) {
          throw new AppError(`Duplicate department code in request: ${departmentCode}`, 400);
        }
  
        nameSet.add(departmentName);
        codeSet.add(departmentCode);
  
        // Check for duplicates in the database
        const existingName = await departmentModel.findOne({
          name: departmentName,
          school: schoolData._id,
        });
        const existingCode = await departmentModel.findOne({
          code: departmentCode,
          school: schoolData._id,
        });
  
        if (existingName) {
          throw new AppError(
            `Department with this name already exists in the database: ${departmentName}`,
            400
          );
        }
        if (existingCode) {
          throw new AppError(
            `Department with this code already exists in the database: ${departmentCode}`,
            400
          );
        }
  
        // Create the new department
        newDepartmentPromises.push(
          departmentModel.create({
            name: departmentName,
            code: departmentCode,
            description: department.description || "",
            school: schoolData._id,
            deleted: department.deleted || false,
            deletedAt: department.deleted ? new Date() : null,
            session: sessionData._id,
          })
        );
      }
  
      // Step 4: Execute all new department creations in parallel
        const createdDepartments = await Promise.all(newDepartmentPromises);

        // Collect the IDs of the newly created departments
        const newDepartmentIds = createdDepartments.map((dept) => dept._id);

        // Update the school's departments field to include the new department IDs
        schoolData.departments = [...schoolData.departments, ...newDepartmentIds];
        await schoolData.save();
  
      // Step 5: Fetch updated school with departments
      const updatedSchool = await schoolModel
        .findById(schoolData._id)
        .populate("departments", "name code description deleted");
  
      res.status(200).json({
        success: true,
        message: "School departments updated successfully",
        data: updatedSchool.departments,
      });
    } catch (err) {
      next(err);
    }
  };
