// models/Department.js
const {Schema , model} = require("mongoose")
const DepartmentSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    departmentCode:{
      type:String,
      required:true,
      trim: true
    },
    school: {
      type: Schema.Types.ObjectId,
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
    programs:{
      type:[Schema.Types.ObjectId]
    },
    session:{
      type:Schema.Types.ObjectId,
      required:[true , "Give the Session for which this department exists"],
      trim:true,
      ref:"sessionModel"
    }
  });
  
  module.exports = model('Department', DepartmentSchema);
  