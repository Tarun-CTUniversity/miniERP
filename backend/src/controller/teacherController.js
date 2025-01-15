// CRUD API / contooler / function for the teacher
// const Teacher = require("../database/models/teacherModel");
const Teacher = require("../database/models/UsersModel/teacherModel");
const AppError = require("../util/ErrorHandler");
const { sendToken } = require("../util/sendToken");

exports.createTeacher = async(req,res,next) =>{
    try{
        const t = await Teacher.findOne({"userID" : req.body.userID});
        if(t){
            throw new AppError("User already Exist",400);
        }

        const teacher = await Teacher.create(req.body);
        if(!teacher){
            throw new AppError("User Cant be created",400);
        }
        await sendToken(teacher,res,next);
        
    }catch(err){
        next(err);
    }
}

exports.teacherLogin = async(req,res,next)=>{
    try{
        const {userID , password} = req.body;

        // check user
        const user = await Teacher.findOne({"userID":userID}).select("+password");
        if(!user){
            throw new AppError("wrong User ID or password",400);
        }

        const result = await user.compare(password);
        if(!result){
            throw new AppError("wrong User ID or password",400);
        }
        
        await sendToken(user,res,next);
        

    }catch(err){
        next(err);
    }
}

exports.teacherLogout = async(req,res,next)=>{
    try{
        
        res.status(200).cookie('token',"",{maxAge:0}).json({
            success:true,
            message:"Logout"
        })

    }catch(err){
        next(err);
    }
}


exports.getTeachersAllData = async(req,res,next) =>{
    try{
        const users = await Teacher.find();
        if(!users){
            throw new AppError("Teachers data not found",404);
        }

        res.status(200).json({
            success:true,
            data : users
        })
    }catch(err){
        next(err);
   }
}

exports.updateTeacherData = async (req, res, next) => {
    try {
        // Destructure fields from req.body
        const { userID , name, school, department, program, email, photo, qualification, mobileNumber } = req.body;

        // Create an object with the destructured values
        const updateData = { 
            name, 
            school, 
            department, 
            program, 
            email, 
            photo, 
            qualification, 
            mobileNumber 
        };

        // Update teacher data excluding userID
        const user = await Teacher.findOneAndUpdate({"userID":userID}, updateData, {
            new: true,              // Return the updated document
            runValidators: true      // Apply schema validation during the update
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Teacher data updated successfully",
            data: user
        });
    } catch (err) {
        next(err);
    }
};
