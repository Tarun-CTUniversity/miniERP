const subjectModel = require("../../database/models/AcadmicModel/subjectModel");
const validateData = require("../../util/dataValidator");
const schoolModel =  require("../../database/models/SchoolModels/schoolModel")
const departmentModel = require("../../database/models/SchoolModels/departmentModel")
const programModel = require("../../database/models/SchoolModels/programModel");
const AppError = require("../../util/ErrorHandler");

exports.createSubject = async(req,res,next)=>{
    try{
        validateData(req.body,subjectModel,["name" , "code" , "school" , "department" , "program"]);
        const {name , code , school , department , program , questions} = req.body; 
        
        const existingSchool = await schoolModel.findById(school);
        if (!existingSchool) {
            throw new AppError("Referenced School does not exist", 404);
        }

        const existingDepartment = await departmentModel.findById(department);
        if (!existingDepartment) {
            throw new AppError("Referenced Department does not exist", 404);
        }

        const existingProgram = await programModel.findById(program);
        if (!existingProgram) {
            throw new AppError("Referenced Program does not exist", 404);
        }

        const existingSub = await subjectModel.findOne({
            $or: [{ name: name.trim() }, { code: code.trim() }]
        });
        if (existingSub) {
            throw new AppError("Subject with the same name or Code already exists", 400);
        }

        subject = await subjectModel.create({
            name , code , school , department , program , questions  });

        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            subject
        });


    }catch(err){
        next(err);
    }


}

exports.updateSubject