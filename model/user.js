const { Timestamp } = require('bson');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {type:String, required:true,trim:true},
    phone: {type:String, required:true, unique:true,trim:true},
    password: {type:String, required:true,trim:true},
    Age:{type:Number,required:true},
    Pincode:{type:Number,required:true},
    Aadhar:{type:String,required:true},
    first_dose:{
      status:{type:Boolean,default:false},
      slot:{type:String},
      date:{type:String},
      center_code:{type:Number}
  },

    second_dose:{
      status:{type:Boolean,default:false},
      slot:{type:String},
      date:{type:String},
      center_code:{type:Number}
  
    },
    


  },{timestamps:true})
  module.exports=mongoose.model('User',userSchema)