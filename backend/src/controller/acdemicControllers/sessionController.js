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
        if (!name) {
            throw new AppError("Session name is required", 400);
          }

        const session = await sessionModel.findOne({ name: name.trim() }) 
          .select("name")
          .populate("schools" , "name code description deleted");

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





// Update Session Data
exports.updateSessionData = async (req, res, next) => {
  try {
    const { name, existingSchools , addedSchools } = req.body;

    if (!name) {
      throw new AppError("Session name is required", 400);
    }

    const session = await sessionModel.findOne({ name: name.trim() });
    if (!session) {
      throw new AppError("No such Session Exists", 400);
    }

    // --- Step 1: Validate all schools before processing ---
    const nameSet = new Set();
    const codeSet = new Set();

    for (const school of existingSchools) {
      const schoolId = school.id;
      const schoolName = school.name?.trim().toUpperCase();
      const schoolCode = school.code?.trim().toUpperCase();

      if (!schoolId || !schoolName || !schoolCode) {
        throw new AppError("Each school must have id, name, and code", 400);
      }

      // Check for duplicates within request list
      if (!isValidObjectId(schoolId) && nameSet.has(schoolName)) {
        throw new AppError(`Duplicate school name in request: ${schoolName}`, 400);
      }
      if (!isValidObjectId(schoolId) && codeSet.has(schoolCode)) {
        throw new AppError(`Duplicate school code in request: ${schoolCode}`, 400);
      }

      nameSet.add(schoolName);
      codeSet.add(schoolCode);
      if(isValidObjectId(schoolId)) {
        continue; // Skip validation for existing schools
      }

      // Check for duplicates in the database
        const [existingName, existingCode] = await Promise.all([
          schoolModel.findOne({ name: schoolName, session: session._id }),
          schoolModel.findOne({ code: schoolCode, session: session._id }),
        ]);

        if (existingName && existingName._id.toString() !== schoolId) {
          throw new AppError(`A school with the name "${schoolName}" already exists in this session.`, 400);
        }

        if (existingCode && existingCode._id.toString() !== schoolId) {
          throw new AppError(`A school with the code "${schoolCode}" already exists in this session.`, 400);
        }
    }

    for (const school of addedSchools) {
      const schoolId = school.id;
      const schoolName = school.name?.trim().toUpperCase();
      const schoolCode = school.code?.trim().toUpperCase();

      if (!schoolId || !schoolName || !schoolCode) {
        throw new AppError("Each school must have id, name, and code", 400);
      }

      // Check for duplicates within request list
      if (!isValidObjectId(schoolId) && nameSet.has(schoolName)) {
        throw new AppError(`Duplicate school name in request: ${schoolName}`, 400);
      }
      if (!isValidObjectId(schoolId) && codeSet.has(schoolCode)) {
        throw new AppError(`Duplicate school code in request: ${schoolCode}`, 400);
      }

      nameSet.add(schoolName);
      codeSet.add(schoolCode);
      if(isValidObjectId(schoolId)) {
        continue; // Skip validation for existing schools
      }

      // Check for duplicates in database
      const existingName = await schoolModel.findOne({ name: schoolName ,session:session._id });
      const existingCode = await schoolModel.findOne({ code: schoolCode , session:session._id });

      if (existingName || existingCode) {
        throw new AppError(`School with this name or code already exists: ${schoolName}`, 400);
      }
    }

    // --- Step 2: Perform updates and collect new creates ---
    const newSchoolPromises = [];
    for (const school of addedSchools) {
      const name = school.name.trim().toUpperCase();
      const code = school.code.trim().toUpperCase();
      const description = school.des;
      const deleted = school.deleted || false;

      if (isValidObjectId(school.id)) {
        await schoolModel.findByIdAndUpdate(
          school.id,
          { name, code, description ,deleted , deletedAt: deleted ? school.deletedAt || new Date() : null },
          { new: true, runValidators: true }
        );
      } else {
        newSchoolPromises.push(
          schoolModel.create({ name, code, description, session: session._id,deleted:deleted })
        );
      }
    }

    for (const school of existingSchools) {
      const name = school.name.trim().toUpperCase();
      const code = school.code.trim().toUpperCase();
      const description = school.des;
      const deleted = school.deleted || false;

      if (isValidObjectId(school.id)) {
        await schoolModel.findByIdAndUpdate(
          school.id,
          { name, code, description ,deleted , deletedAt: deleted ? school.deletedAt || new Date() : null },
          { new: true, runValidators: true }
        );
      } else {
        newSchoolPromises.push(
          schoolModel.create({ name, code, description, session: session._id,deleted:deleted })
        );
      }
    }

    // Create new schools in parallel
    const newSchools = await Promise.all(newSchoolPromises);
    const newSchoolIds = newSchools.map(s => s._id);

    // --- Step 3: Update session with new schools ---
    const updatedSession = await sessionModel.findByIdAndUpdate(
      session._id,
      { $addToSet: { schools: { $each: newSchoolIds } } },
      { new: true, runValidators: true }
    ).populate("schools", "name code description deleted");

    res.status(200).json({
      success: true,
      message: "Session data updated successfully",
      data: updatedSession
    });

  } catch (err) {
    next(err);
  }
};

//Delete schools from session
exports.deleteSchoolsFromSession = async (req, res, next) => {
    try {
        const { name, schools } = req.body;
        const schoolId = schools.map((school)=>school.id);

        const session = await sessionModel.findOne({name:name.trim()});
        if (!session) {
            throw new AppError("Session not found", 404);
        }    
        
        //delete all the schools which are not inside the schools array
        const sessionSchools = session.schools;
        const schoolsToDelete = sessionSchools.filter((school)=> !schoolId.includes(school._id.toString()));

        await Promise.all(
          schoolsToDelete.map((schoolID) =>
            schoolModel.findByIdAndUpdate(
              schoolID,
              { deleted: true, deletedAt: new Date() },
              { new: true }
            )
          )
        );

        // Update the session to remove the deleted schools
        session.schools = session.schools.filter((school) => !schoolsToDelete.includes(school.toString()));
        await session.save();

        const populatedSession = await sessionModel.findById(session._id).populate('schools', 'code description name deleted');
        res.status(200).json({
            success: true,
            message: "Schools deleted from session successfully",
            data: populatedSession.schools
        });
    } catch (err) {
        next(err);
    }
}
