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
    },
    specializations:{
      type:[mongo.Schema.Types.ObjectId],
      ref:"Specialization"
    },
    deleted: {
        type: Boolean,
        default: false
      },
      deletedAt: {
        type: Date,
        default: null
      }
}, { timestamps: true })

module.exports = mongo.model("sessionModel",sessionSchema);