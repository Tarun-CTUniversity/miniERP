const mongoose = require("mongoose");
const specializationModel = require("../../database/models/SchoolModels/specializationModel");
const sessionModel = require("../../database/models/AcadmicModel/sessionModel");
const AppError = require("../../util/ErrorHandler");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * 1. Create a New Specialization
 */
exports.createSpecialization = async (req, res, next) => {
    try {
        const { name, specializationCode, description, session } = req.body;

        // Validate required fields
        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new AppError("Name is required and must be a non-empty string", 400);
        }

        if (!specializationCode || typeof specializationCode !== 'string' || !specializationCode.trim()) {
            throw new AppError("Specialization Code is required and must be a non-empty string", 400);
        }

        if (!Array.isArray(session) || session.length === 0 || !session.every(s => typeof s === 'string' && s.trim())) {
            throw new AppError("Session must be a non-empty array of non-empty strings", 400);
        }

        

        // Check for unique specialization name and specializationCode
        const existingSpecialization = await specializationModel.findOne({
            $or: [{ name: name.trim() }, { specializationCode: specializationCode.trim() }]
        });
        if (existingSpecialization) {
            throw new AppError("Specialization with the same name or specializationCode already exists", 400);
        }

        // Create and save the specialization
        const specialization = await specializationModel.create({
            name: name.trim(),
            specializationCode: specializationCode.trim(),
            description: description ? description.trim() : undefined,
            session: session.map(s => s.trim())
        });

        res.status(201).json({
            success: true,
            message: `Specialization ${specialization.name} created successfully`,
            data: specialization
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 2. Update Description of a Specialization
 */
exports.updateDescriptionOfSpecialization = async (req, res, next) => {
    try {
        const { id, description } = req.body;

        // Validate input
        if (!id || !description) {
            throw new AppError("Specialization ID and description are required", 400);
        }

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Specialization ID format", 400);
        }

        if (typeof description !== 'string' || !description.trim()) {
            throw new AppError("Description must be a non-empty string", 400);
        }

        // Find and update the specialization
        const specialization = await specializationModel.findById(id);
        if (!specialization) {
            throw new AppError("Specialization not found", 404);
        }

        specialization.description = description.trim();
        await specialization.save();

        res.status(200).json({
            success: true,
            message: 'Specialization description updated successfully',
            data: specialization
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 3. Add Session to a Specialization
 */
exports.addSpecializationSession = async (req, res, next) => {
    try {
        const { id, session } = req.body;

        // Validate input
        if (!id || !session || typeof session !== 'string' || !session.trim()) {
            throw new AppError("Valid Specialization ID and session are required", 400);
        }

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Specialization ID format", 400);
        }

        // Find the specialization
        const specialization = await specializationModel.findById(id);
        if (!specialization) {
            throw new AppError("Specialization not found", 404);
        }

        // Check if session already exists
        if (specialization.session.includes(session.trim())) {
            throw new AppError("Session already exists for this specialization", 400);
        }

        // Add the new session
        specialization.session.push(session.trim());
        await specialization.save();

        res.status(201).json({
            success: true,
            message: "Session added successfully",
            data: specialization
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 4. Get All Specialization Names with IDs
 */
exports.getAllSpecializationNames = async (req, res, next) => {
    try {
        const specializations = await specializationModel.find().select("name _id");
        if (specializations.length === 0) {
            throw new AppError("No specializations found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Specialization names retrieved successfully",
            data: specializations
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 5. Get Specific Specialization Data by ID
 */
exports.getSpecializationData = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            throw new AppError("Please provide the specialization ID", 400);
        }

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Specialization ID format", 400);
        }

        const specialization = await specializationModel.findById(id).populate('name');
        if (!specialization) {
            throw new AppError("Specialization not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Specialization data retrieved successfully",
            data: specialization
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 6. Get Data of All Specializations
 */
exports.getAllSpecializationData = async (req, res, next) => {
    try {
        const specializations = await specializationModel.find().populate('name');
        if (specializations.length === 0) {
            throw new AppError("No specializations found", 404);
        }

        res.status(200).json({
            success: true,
            message: "All specializations retrieved successfully",
            data: specializations
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 7. Update Specialization (Excluding name, specializationCode,)
 */
exports.updateSpecialization = async (req, res, next) => {
    try {
        const { description, session } = req.body;
        const { id } = req.params;

        // Validate ID
        if (!id) {
            throw new AppError("Specialization ID is required", 400);
        }

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Specialization ID format", 400);
        }

        // Find the specialization
        const specialization = await specializationModel.findById(id);
        if (!specialization) {
            throw new AppError("Specialization not found", 404);
        }

        // Update only allowed fields
        if (description !== undefined) {
            if (typeof description !== 'string' || !description.trim()) {
                throw new AppError("Description must be a non-empty string", 400);
            }
            specialization.description = description.trim();
        }

        if (session !== undefined) {
            if (!Array.isArray(session) || session.length === 0 || !session.every(s => typeof s === 'string' && s.trim())) {
                throw new AppError("Session must be a non-empty array of non-empty strings", 400);
            }
            specialization.session = session.map(s => s.trim());
        }

        await specialization.save();

        res.status(200).json({
            success: true,
            message: 'Specialization updated successfully',
            data: specialization
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 8. Delete a Specialization
 */
exports.deleteSpecialization = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            throw new AppError("Specialization ID is required", 400);
        }

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid Specialization ID format", 400);
        }

        const specialization = await specializationModel.findById(id);
        if (!specialization) {
            throw new AppError("Specialization not found", 404);
        }

        await specialization.remove();

        res.status(200).json({
            success: true,
            message: 'Specialization deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.getSpecializationBySession = async(req,res,next)=>{
    try{
        const sessionID = req.params.sessionID;

        const specializations = await sessionModel.findById(sessionID).select("specializations").populate("specializations");

        if(!specializations){
            throw new AppError("Specializations not found",404);
        }
        
        res.status(200).json({
            data:specializations,
            success: true
        });

    }catch(err){
        next(err);
    }
}


exports.updateSessionSpecializations = async (req, res, next) => {
  try {
    const { sessionID, existingSpec = [], newSpec = [] } = req.body;
    console.log(req.body);
    // Step 1: Validate session ID
    if (!mongoose.Types.ObjectId.isValid(sessionID)) {
      throw new AppError("Invalid session ID", 400);
    }

    const sessionDoc = await sessionModel.findById(sessionID);
    if (!sessionDoc) {
      throw new AppError("Session not found", 404);
    }

    // Step 2: Validate uniqueness of specialization names and codes
    const allSpecs = [...existingSpec, ...newSpec];
    const nameSet = new Set();
    const codeSet = new Set();

    for (const spec of allSpecs) {
      const normalizedName = spec.name.trim().toUpperCase();
      const normalizedCode = spec.code.trim().toUpperCase();

      if (nameSet.has(normalizedName)) {
        throw new AppError(`Duplicate specialization name found: ${spec.name}`, 400);
      }
      if (codeSet.has(normalizedCode)) {
        throw new AppError(`Duplicate specialization code found: ${spec.code}`, 400);
      }

      nameSet.add(normalizedName);
      codeSet.add(normalizedCode);
    }

    // Step 3: Update existing specializations
    for (const spec of existingSpec) {
      if (!mongoose.Types.ObjectId.isValid(spec.id)) {
        throw new AppError(`Invalid specialization ID: ${spec.id}`, 400);
      }

      await specializationModel.findByIdAndUpdate(
        spec.id,
        {
          name: spec.name,
          code: spec.code,
          description: spec.des || "",
          deleted: spec.deleted || false,
          deletedAt: spec.deleted ? new Date() : null,
        },
        { new: true, runValidators: true }
      );
    }

    // Step 4: Create new specializations
    const newSpecDocs = await specializationModel.insertMany(
      newSpec.map((spec) => ({
        name: spec.name,
        code: spec.code,
        description: spec.des || "",
        deleted: false,
        session:sessionID
      }))
    );

    // Step 5: Update session.specializations with new specialization IDs
    const newSpecIds = newSpecDocs.map((doc) => doc._id);
    sessionDoc.specializations.push(...newSpecIds);
    await sessionDoc.save();

    // Step 6: Fetch and return updated specializations under this session
    const updatedSpecs = await specializationModel.find({ sessionID });

    res.status(200).json({
      success: true,
      message: "Specializations updated successfully",
      data: {
        specs: updatedSpecs,
      },
    });
  } catch (err) {
    next(err);
  }
};