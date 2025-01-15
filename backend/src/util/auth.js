const jwt = require("jsonwebtoken");
const AppError = require("./ErrorHandler");
const Teacher = require("../database/models/UsersModel/teacherModel")


exports.isAuthenticated = async(req,res,next) =>{
    try{
        const {token} = req.cookies;

        if(!token){
            throw new AppError("Please Login first",400);
        }

        const {id }= await jwt.verify(token,process.env.SECRET_KEY);
        if(!id){
            throw new AppError("Wrong or expired token",400);
        }

        const user = await Teacher.findById(id);
        if(!user){
            throw new AppError("Unactive User / User not found",404);
        }
        
        res.user = user;
        next();

    }catch(err){
        next(err);
    }
}


exports.isAuthorized= (...Authusers)=>{
    return async (req,res,next) =>{
        try{
            const {token} = req.cookies;

            if(!token){
                throw new AppError("Please Login first",400);
            }

            const {id }= await jwt.verify(token,process.env.SECRET_KEY);
            if(!id){
                throw new AppError("Wrong or expired token",400);
            }

            const user = await Teacher.findById(id);
            if(!user){
                throw new AppError("Unactive User / User not found",404);
            }
            
            // Check if user has at least one of the roles in Authusers
            const hasRole = user.roles.some(role => Authusers.includes(role));

            if (!hasRole) {
                throw new AppError("Unauthorized role", 403); // Forbidden
            }
 
            // Attach user to the response object and proceed
            res.user = user;
            next();
        }catch(err){
            next(err);
        }
    }
}