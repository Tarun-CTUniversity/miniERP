const mongo = require("mongoose");


const studentSchema = mongo.Schema({
    name:{
        type:String,
        required:[true,"Please give the name of user"],
        trim:true
    },
    userID:{
        type:String,
        required:[true,"Please give the user ID"],
        trim:true,
        minLength:[5, "Please enter the userID properly"]
    },
    mobileNumber:{
        type:Number,
        length:10
    },
    photo:{
        type:String
    },

    fathername:{
        type:String
    },

    school:{
        type:String,
        trim : true,
        required:[true , "Please add the School Name"]
    },
    department:{
        type:String,
        trim : true,
        required:[true , "Please add the Department Name"]
    },
    program:{
        type:String,
        trim : true,
        required:[true , "Please add the Program Name"]
    },
    Specialization:{
        type:String,
        trim : true,
        required:[true , "Please add the Specialization"]
    },
    section:{
        type:String,
        required:[true, "Please add the your Section"]
    },
    group:{
        type:String
    },
    status:{
        type:String,
        default:"still"
    },
    role:{
        type:String,
        default:"student"
    },
    roles: {
        type: [String],
        enum: [ "student","CR" , "eventHelper","speaker"]
    }
       
})