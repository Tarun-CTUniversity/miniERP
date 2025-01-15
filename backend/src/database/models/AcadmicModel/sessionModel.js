const mongo = require("mongoose")

const sessionSchema = mongo.Schema({
    name:{
        type:String,
        required:[true,"Give the session"],
        trim:true
    },
    schools:{
        type:[mongo.Schema.Types.ObjectId],
        required:[true,"Please give the schools in this session"],
        ref:"School"
    }
})

module.exports = mongo.model("sessionModel",sessionSchema);