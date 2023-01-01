const mongoose= require("mongoose")

const vaccineSchema= new mongoose.Schema({
    center:{type:String,required:true},
    center_code:{type:Number,required:true},
    date:{type:String,required:true},
    slot:[{
        time:{type:String},
        quantity:{type:Number,default:10}
    }],
    totalvaccine:{type:Number,default:1400},
    totalFirst:{type:Number,default:0},
    totalSecond:{type:Number,default:0}
},{timestamps:true})

module.exports= mongoose.model("Vaccine",vaccineSchema)