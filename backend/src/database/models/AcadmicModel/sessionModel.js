const mongo = require("mongoose")

const sessionSchema = mongo.Schema({
    name:{
        type:String,
        required:[true,"Give the session"],
        trim:true
    },
    schools:{
        type:[mongo.Schema.Types.ObjectId],
        ref:"School"
    }
})

module.exports = mongo.model("sessionModel",sessionSchema);