// models/School.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const SchoolSchema = new Schema({
  name: {
    type: String,
    required: [true , "Give the name of School"],
    trim: true
  },
  code: {
    type: String,
    required: [true , "Give the School Code"],
    trim: true
  },
  description:{
    type: String,
    trim: true
  },
  session:{
      type:mongoose.Schema.Types.ObjectId,
      required:[true , "Give the Session for which this school exists"],
      trim:true,
      ref:"sessionModel"
  },
  departments:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"Department"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('School', SchoolSchema);
