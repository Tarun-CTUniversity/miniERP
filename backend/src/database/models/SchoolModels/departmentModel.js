// models/Department.js
const {Schema , model} = require("mongoose")
const DepartmentSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    code:{
      type:String,
      required:true,
      trim: true
    },
    school: {
      type: Schema.Types.ObjectId,
      required:true,
      ref: 'School',
      required: true
    },
    description: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    programs:[{
      type:Schema.Types.ObjectId,
      ref:"Programme"
    }],
    session:{
      type:Schema.Types.ObjectId,
      required:[true , "Give the Session for which this department exists"],
      trim:true,
      ref:"sessionModel"
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  }, { timestamps: true });
  
  module.exports = model('Department', DepartmentSchema);
  