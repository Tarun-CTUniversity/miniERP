// models/Specialization.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const SpecializationSchema = new Schema({
    name:{
      type: String,
      required: true,
      unique: true,
      trim: [true,"Give the name of Specialization"]
    },
    code:{
      type:String,
      required: [true , "Give the Specialization Code"]
    },
    description: {
      type: String
    },
    session:{
      type:mongoose.Schema.Types.ObjectId,
      required:[true , "Give the Session for which this specialization exists"],
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
  
module.exports = mongoose.model('Specialization', SpecializationSchema);
  