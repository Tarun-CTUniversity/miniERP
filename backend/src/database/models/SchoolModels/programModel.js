// models/Programme.js
const {Schema , model} = require("mongoose");
const { deleteOne } = require("./schoolModel");
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
    code:{
      type:String,
      required: [true , "Give the programme Code"]
    },
    degreeType: {
      type: String,
      required: [true , " Give type of Degree"],
    },
    duration:{
      type: Number, // Duration in semesters or years
      required: true
    },
    description:{
      type: String
    },
    specializations: [{
      type: Schema.Types.ObjectId, // Array of specializations
      ref: 'Specialization'
    }],
    session:{
      type:Schema.Types.ObjectId,
      required:[true , "Give the Session for which this program exists"],
      trim:true,
      ref:"sessionModel"
  },
    createdAt: {
      type: Date,
      default: Date.now
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
  
  module.exports = model('Programme', ProgrammeSchema);
  