const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const teacherSchema = new mongo.Schema({
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
    password:{
        type:String,
        required:[true,"Please give Password for user"],
        select:false
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
    email:{
        type:String
    },
    photo:{
        type:String
    },
    subjectInterest:[
        {
            type:String
        }
    ],
    qualification:{
        type:String,
        trim:true
    },
    mobileNumber:{
        type:Number,
        length:10
    },
    classIncharge:[
        {
            session:String,
            classes:[]
        }
    ],
    subjectTeaching:[
        {
            session:String,
            subjects:[]
        }
    ],
    status:{
        type:String,
        default:"still"
    },
    role:{
        type:String,
        default:"teacher"
    },
    roles: {
        type: [String],
        enum: ['teacher', 'HOS', 'HOD', 'exam_coordinator'],
        default: ['teacher']
    }
})

teacherSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
    next();    
})

teacherSchema.methods.compare= async function(password){
    return await bcrypt.compare(password,this.password);
}

teacherSchema.methods.createToken= async function(){
    const token = await jwt.sign({id:this._id},process.env.SECRET_KEY,{ expiresIn: process.env.TOKEN_EXPIRY });
    return token;
}


module.exports = mongo.model("Teacher",teacherSchema);