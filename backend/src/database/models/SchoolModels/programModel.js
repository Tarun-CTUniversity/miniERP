// models/Programme.js
const {Schema , model} = require("mongoose");
const ProgrammeSchema = new Schema({
    name: {
      type: String,
      required: [true , "Give the name of Programme"],
      unique: true,
      trim: true
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true , "Give the department name"]
    },
    programmeCode:{
      type:String,
      required: [true , "Give the programme Code"]
    },
    degreeType: {
      type: String,
      enum: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'],
      required: [true , " Give type of Degree"]
    },
    duration:{
      type: Number, // Duration in semesters or years
      required: true
    },
    description:{
      type: String
    },
    session:{
      type:Schema.Types.ObjectId,
      required:[true , "Give the Session for which this program exists"],
      trim:true,
      ref:"sessionModel"
  },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = model('Programme', ProgrammeSchema);
  