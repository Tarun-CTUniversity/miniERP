const AppError = require("./ErrorHandler");
const mongoose = require('mongoose');

/**
 * Validates data against the provided Mongoose model's schema.
 * @param {Object} data - The data object to validate (e.g., req.body).
 * @param {mongoose.Model} model - The Mongoose model to extract schema definitions.
 * @throws {AppError} Throws an error if validation fails.
 */
const validateData = (data, model,requiredField) => {
    const schemaPaths = model.schema.paths;

    for (const field in schemaPaths) {
        const path = schemaPaths[field];
        const value = data[field];
        const isRequired = requiredField.includes(field);

        // Check if field is required and present
        if (isRequired && (value === undefined || value === null || value === '')) {
            throw new AppError(`${field} is required`, 400);
        }

        // If not required and not present, skip further validations
        if (!isRequired && (value === undefined || value === null || value === '')) {
            continue;
        }

        // Validate data type
        const type = path.instance.toLowerCase();
        switch (type) {
            case 'string':
                if (typeof value !== 'string') {
                    throw new AppError(`${field} must be a string`, 400);
                }
                if (path.options.trim && value.trim() === '') {
                    throw new AppError(`${field} cannot be empty`, 400);
                }
                if (path.options.maxLength && value.length > path.options.maxLength) {
                    throw new AppError(`${field} must have at most ${path.options.maxLength} characters`, 400);
                }
                if (path.options.minLength && value.length < path.options.minLength) {
                    throw new AppError(`${field} must have at least ${path.options.minLength} characters`, 400);
                }
                break;

            case 'number':
                if (typeof value !== 'number') {
                    throw new AppError(`${field} must be a number`, 400);
                }
                if (path.options.min && value < path.options.min) {
                    throw new AppError(`${field} must be at least ${path.options.min}`, 400);
                }
                if (path.options.max && value > path.options.max) {
                    throw new AppError(`${field} must be at most ${path.options.max}`, 400);
                }
                break;

            case 'array':
                if (!Array.isArray(value)) {
                    throw new AppError(`${field} must be an array`, 400);
                }
                break;

            case 'objectid':
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new AppError(`${field} must be a valid ObjectId`, 400);
                }
                break;

            default:
                throw new AppError(`Unsupported field type: ${type}`, 500);
        }
    }
};

module.exports = validateData;
