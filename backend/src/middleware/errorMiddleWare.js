exports.errorHandler=(err,req,res,next)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            success:false,
            message:err.message
        })
    }else{
        // Mongo DB Error
        if(err.name == "CastError"){
            return res.status(500).json({
                success:false,
                message: err.message
            })
        }
        if(err.name == "ValidationError"){
            return res.status(500).json({
                success:false,
                message: err
            })
        }
        // Duplicate Key
        if(err.code == 11000){
            return res.status(500).json({
                success:false,
                message: err.message
            })
        }
        console.log(err);
        res.status(500).json({
            success:false,
            message: err.message
        });
    }
}