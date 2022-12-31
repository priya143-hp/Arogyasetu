const mongoose= require("mongoose")

const vaccineSchema= new mongoose.Schema({
    center:{type:String,required:true},
    center_code:{type:Number,required:true},
    date:{type:Date,required:true},
    slot:[{
        time:{type:String},
        quantity:{type:Number,default:10}
    }]
    
},{timestamps:true})

module.exports= mongoose.model("Vaccine",vaccineSchema)