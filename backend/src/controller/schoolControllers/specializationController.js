const mongoose = require("mongoose");
const specializationModel = require("../../database/models/SchoolModels/specializationModel");
const AppError = require("../../util/ErrorHandler");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * 1. Create a New Specialization
 */
exports.createSpecialization = async (req, res, next) => {
    try {
        const { name, programme, specializationCode, description, session } = req.body;

        // Validate required fields
        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new AppError("Name is required and must be a non-empty string", 400);
        }

        if (!programme || typeof programme !== 'string' || !programme.trim()) {
            throw new AppError("Programme ID is required and must be a non-empty string", 400);
        }

        if (!specializationCode || typeof specializationCode !== 'string' || !specializationCode.trim()) {
            throw new AppError("Specialization Code is required and must be a non-empty string", 400);
        }

        if (!Array.isArray(session) || session.length === 0 || !session.every(s => typeof s === 'string' && s.trim())) {
            throw new AppError("Session must be a non-empty array of non-empty strings", 400);
        }

        // Validate Programme ObjectId
        if (!isValidObjectId(programme)) {
            throw new AppError("Invalid Programme ID format", 400);
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
            programme: programme.trim(),
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

        const specialization = await specializationModel.findById(id).populate('programme', 'name');
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
        const specializations = await specializationModel.find().populate('programme', 'name');
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
 * 7. Update Specialization (Excluding name, specializationCode, and programme)
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
