const mongo = require("mongoose");

const subjectSchema = new mongo.Schema({
    name : {
        type:String,
        required:[true,"Please give the name of Subject"],
        trim:true
    },
    code:{
        type:String,
        required:[true,"Please give subject Code"],
        trim:true
    },
    school:{
        type:String,
        required:[true,"Please give School Name"],
        trim:true
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
    questions:{
        "MCQ":[
            {
                "Q":{
                    type:String,
                    trim:true,
                    required:[true,"Give the MCQ question"]
                },
                "O1":{
                    type:String,
                    trim:true,
                    required:[true,"Give all options"]
                },
                "O2":{
                    type:String,
                    trim:true,
                    required:[true,"Give all options"]
                },
                "O3":{
                    type:String,
                    trim:true,
                    required:[true,"Give all options"]
                },
                "O4":{
                    type:String,
                    trim:true,
                    required:[true,"Give all options"]
                },
                "level":{
                    type:Number,
                    enum:[1,2,3],
                    required:[true,"Give level of question"]
                },
                "used":[
                    {
                        type:String
                    }
                ]
            }
        ],
        "subjective" :[
            {
                "Q":{
                    type:String,
                    trim:true,
                    required:[true,"Give the Subjective question"]
                },
                "level":{
                    type:Number,
                    enum:[1,2,3],
                    required:[true,"Give level of question"]
                },
                "marks":{
                    type:Number,
                    required:[true,"Please give mark of this question"]
                },
                "unit":{
                    type:Number,
                    required:[true,"Please give unit number"]
                }
            }
        ]      
    }
})

module.exports = mongo.model("subjectModel",subjectSchema);