const AppError = require("./ErrorHandler");

exports.sendToken = async(user,res,next)=>{
    try{
        const token = await user.createToken();
        if(!token){
            throw new AppError("Problem while creating Token",400);
        }
        
        res.status(200).cookie('token',
            token,
            {
                maxAge:2*24*60*60*1000,
                httpOnly: true
        }).json({
            success:true,
            message:"Signed In"
        })
    }catch(err){
        next(err);
    }
}