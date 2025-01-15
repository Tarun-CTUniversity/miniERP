const mongo = require("mongoose");

const classSchema = new mongo.Schema({
    name:{
        type:String,
        required:[true,"please give name of the class"]
    }  

})


module.exports = mongo.model("classModel",classSchema);