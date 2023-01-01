const userModel=require("../model/user")
const slotModel=require("../model/slotmodel")
const {isValidObjectId,isValidPincode ,isValidString,isValidPhone,isValidPswd,isValidDate}=require("../util/validation")
const jwt = require('jsonwebtoken');

const creatuser=async function(req,res){
    try{
        let data=req.body
        if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"can't create user with empty body"})

      let {name,phone,password,Age,Pincode,Aadhar}=data
     
      let newArr=["name","phone","password","Age","Pincode","Aadhar"]
      for(i of newArr){
       if(!data[i])return res.status(400).send({status:false,msg:`${i} is mandatory please input ${i}`})
      }


      if(isValidString(name.trim()) || !name.trim())return res.status(400).send({status:false,msg:"please enter a valid name"})
      if(!isValidPhone(phone.trim()))return res.status(400).send({status:false,msg:"please enter a valid phone No"})
      if(!isValidPswd(password.trim()))return res.status(400).send({status:false,msg:"please enter a valid password"})
      if (!isValidPincode(Pincode))return res.status(400).send({ status: false, message: "please enter a valid pincode " }) 
      if(typeof(Age)!="number" || Age==0)return res.status(400).send({ status: false, message: "please enter a valid age in numbers" }) 
      if(typeof(Aadhar)!="number")return res.status(400).send({ status: false, message: "please enter a valid aadhar no in numbers" }) 
      if(Aadhar.toString().length!=12)return res.status(400).send({ status: false, message: "please enter a valid aadhar no" }) 



 const oldUser=await userModel.findOne({phone:phone}) 
 if(oldUser)return res.status(400).send({status:true,msg:"User already exist with this Mobile no"})      

 const oldUser1=await userModel.findOne({Aadhar:Aadhar}) 
 if(oldUser1)return res.status(400).send({status:true,msg:"User already exist with this aadhar no"})      


 const user=await userModel.create(data)
 res.status(201).send({status:true,data:user})
    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

const login=async function(req,res){
    try{
        let data=req.body
        let {phone,password}=data
        if(!password)return res.status(400).send({status:false,msg:"can't login without password"})
        if(!phone)return res.status(400).send({status:false,msg:"can't login without Mobile No"})

       const login=await userModel.findOne({phone:phone})
       if(!login)return res.status(400).send({status:false,msg:"can't find any user with this mobile no"})
       if(login.password!=password)return res.status(400).send({status:false,msg:"Please enter a correct password"})
       
       let token=jwt.sign({userId:login._id},"secret",{expiresIn:"10d"})

       res.status(200).send({status:true,data:token})

    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

const slotBook=async function(req,res){         //userId in params
    try{

 let userId=req.params.userId
 let data=req.body
 let {dose,date,slot,center_code}=data

 if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"can't book slot without data"})

 if(!isValidObjectId(userId)){
    return res.status(400).send({status:false,message:"invalid userId,please provide correct userId"})
   }

 let newArr=["dose","date","slot","center_code"]
 for(i of newArr){
  if(!data[i])return res.status(400).send({status:false,msg:`${i} is mandatory please input ${i}`})
 }

if(!isValidDate(date))return res.status(400).send({status:false,msg:"please put date in MM/DD/YYYY formate"})
if([1,2].indexOf(dose)<0 ){
    return res.status(400).send({status:false,message:"Enter your vaccin dose 1 or 2"})
  }

 if(dose==1){


    let d1=new Date().toISOString().split("T")[0]

    let arr=(d1.split("-"))
    let x=arr[1]+"/"+arr[2]+"/"+arr[0]
    
    const date1 = new Date(x);
    const date2 = new Date(date);
    let diffTime = (date2 - date1)/ (1000 * 60 * 60)
    if(diffTime<0)return res.status(400).send({status:false , msg:"can't book vaccine in old date"})
    if(diffTime==0)return res.status(400).send({status:false , msg:"can't book vaccine in same date"})


    const user=await userModel.findById(userId)
    if(!user)return res.status(400).send({status:false,msg:"User not found"})
    if(user.first_dose.status==true)return res.status(400).send({status:false,msg:"you already apply for 1st dose"})

//find slot

const vaccineCenter= await slotModel.findOne({center_code:center_code,date:date})
if(!vaccineCenter)return res.status(400).send({status:false,msg:"No vaccination center found please enter a valid center with a date"})

let availSlot=vaccineCenter.slot

for(i=0;i<availSlot.length;i++){
    if(availSlot[i].time==slot){
        var index=i
        var Vaccin_no= availSlot[i].quantity
        if(Vaccin_no==0)return res.status(400).send({status:false,msg:"No vaccin available in this time slot"})
    }
}

let newObj={
    status:true,
    slot:slot,
    date:date,
    center_code:center_code
}


//new
let total=vaccineCenter.totalvaccine-1
let totalfirst=vaccineCenter.totalFirst+1



    const updateUser=await userModel.findOneAndUpdate({_id:userId},{first_dose:newObj},{new:true})

    //slot update in slot model

let updatedData={
    time:slot,
    quantity:(Vaccin_no-1)
}

availSlot.splice(index,1,updatedData)

await slotModel.findOneAndUpdate({center_code:center_code,date:date},{slot:availSlot,totalvaccine:total,totalFirst:totalfirst})
return res.status(201).send({status:true,msg:"slot booked successfully",data:updateUser})
 }




 if(dose==2){

    let d1=new Date().toISOString().split("T")[0]

    let arr=(d1.split("-"))
    let x=arr[1]+"/"+arr[2]+"/"+arr[0]
    
    const date1 = new Date(x);
    const date2 = new Date(date);
    let diffTime = (date2 - date1)/ (1000 * 60 * 60)
    if(diffTime<0)return res.status(400).send({status:false , msg:"can't book vaccine in old date"})
    if(diffTime==0)return res.status(400).send({status:false , msg:"can't book vaccine in same date"})


const user=await userModel.findById(userId)
if(!user)return res.status(400).send({status:false,msg:"User not found"})
if(user.second_dose.status==true)return res.status(400).send({status:false,msg:"you alredy apply for 2nd dose"})
if(user.first_dose.status==false)return res.status(400).send({status:false,msg:"you can not apply for 2nd dose before taking 1st dose"})

  //find slot

        const vaccineCenter= await slotModel.findOne({center_code:center_code,date:date})
        if(!vaccineCenter)return res.status(400).send({status:false,msg:"No vaccination center found please enter a valid center with a date"})
        
        let availSlot=vaccineCenter.slot
        
        for(i=0;i<availSlot.length;i++){
            if(availSlot[i].time==slot){
                var index=i
                var Vaccin_no= availSlot[i].quantity
                if(Vaccin_no==0)return res.status(400).send({status:false,msg:"No vaccin available in this time slot"})
            }
        }
        


  let newObj={
    status:true,
    slot:slot,
    date:date,
    center_code:center_code
}

const updateUser=await userModel.findOneAndUpdate({_id:userId},{second_dose:newObj},{new:true})


    //slot update in slotmodel

    let updatedData={
        time:slot,
        quantity:(Vaccin_no-1)
    }



//new
let total=vaccineCenter.totalvaccine-1
let totalSecond=vaccineCenter.totalSecond+1

    
    availSlot.splice(index,1,updatedData)
    
    await slotModel.findOneAndUpdate({center_code:center_code,date:date},{slot:availSlot,totalvaccine:total,totalSecond:totalSecond})

    return res.status(201).send({status:true,msg:"slot book successfully",data:updateUser})
 }

    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}



const slotDelete=async function(req,res){
    try{
        
 let userId=req.params.userId

 if(!isValidObjectId(userId)){
    return res.status(400).send({status:false,message:"invalid userId,please provide correct userId"})
   }

const user=await userModel.findById(userId)
if(!user)return res.status(400).send({status:false,msg:"can't find any user"})

if(user.first_dose.status==true && user.second_dose.status==true){

let slotTime=user.second_dose.slot
let timing=parseInt(slotTime.split(":")[0])


//24 hour diff
let d1=new Date().toISOString().split("T")[0]

let arr=(d1.split("-"))
let x=arr[1]+"/"+arr[2]+"/"+arr[0]

const date1 = new Date(x);
const date2 = new Date(user.second_dose.date);
let diffTime = (date2 - date1)/ (1000 * 60 * 60)
if(diffTime<0)return res.status(400).send({status:false , msg:"The vaccine already taken "})
if(diffTime==0)return res.status(400).send({status:false , msg:"Can't reschedule in same day "})
if(diffTime>=24){diffTime=diffTime-24}


let d=new Date().toISOString().split("T")[1]
let time=parseInt(d.split(".")[0])
let diff=19-time+timing+diffTime


if(diff<=24)return res.status(400).send({status:false,msg:`you cant change your vaccination slot before ${diff} hour`})
    let newObj={
        status:false,
        slot:"",
        date:"" 
    }
    const updateUser=await userModel.findByIdAndUpdate({_id:userId},{second_dose:newObj},{new:true})

//adding the vacc

let center_code=user.second_dose.center_code
let date=user.second_dose.date
let slot=user.second_dose.slot

const vaccineCenter= await slotModel.findOne({center_code:center_code,date:date})
if(!vaccineCenter)return res.status(400).send({status:false,msg:"No vaccination center found please enter a valid center with a date"})

let availSlot=vaccineCenter.slot

for(i=0;i<availSlot.length;i++){
    if(availSlot[i].time==slot){
        var index=i
        var Vaccin_no= availSlot[i].quantity
    }
}

 //slot update in slot model

let updateData={
    time:slot,
    quantity:(Vaccin_no+1)
}


let total=vaccineCenter.totalvaccine+1
let totalSecond=vaccineCenter.totalSecond-1


availSlot.splice(index,1,updateData)

await slotModel.findOneAndUpdate({center_code:center_code,date:date},{slot:availSlot,totalvaccine:total,totalSecond:totalSecond})


    return res.status(200).send({status:true,msg:"your 2nd dose vaccination Slot deleted successfully ",data:updateUser})
}




let slotTime=user.first_dose.slot
let timing=parseInt(slotTime.split(":")[0])


//24 hour diff
let d1=new Date().toISOString().split("T")[0]

let arr=(d1.split("-"))
let x=arr[1]+"/"+arr[2]+"/"+arr[0]

const date1 = new Date(x);
const date2 = new Date(user.first_dose.date);
let diffTime = (date2 - date1)/ (1000 * 60 * 60)
if(diffTime<0)return res.status(400).send({status:false , msg:"The vaccine already taken "})
if(diffTime==0)return res.status(400).send({status:false , msg:"Can't reschedule in same day "})
if(diffTime>=24){diffTime=diffTime-24}


let d=new Date().toISOString().split("T")[1]
let time=parseInt(d.split(".")[0])
let diff=19-time+timing+diffTime



if(diff<=24)return res.status(400).send({status:false,msg:`you cant change your vaccination slot before ${diff} hour`})
    let newObj={
        status:false,
        slot:"",
        date:"" 
    }
    const updateUser=await userModel.findByIdAndUpdate({_id:userId},{first_dose:newObj},{new:true})

//adding the vacc
    
let center_code=user.first_dose.center_code
let date=user.first_dose.date
let slot=user.first_dose.slot

const vaccineCenter= await slotModel.findOne({center_code:center_code,date:date})
if(!vaccineCenter)return res.status(400).send({status:false,msg:"No vaccination center found please enter a valid center with a date"})

let availSlot=vaccineCenter.slot

for(i=0;i<availSlot.length;i++){
    if(availSlot[i].time==slot){
        var index=i
        var Vaccin_no= availSlot[i].quantity
    }
}

 //slot update in slot model

let updateData={
    time:slot,
    quantity:(Vaccin_no+1)
}


let total=vaccineCenter.totalvaccine+1
let totalfirst=vaccineCenter.totalFirst-1


availSlot.splice(index,1,updateData)

await slotModel.findOneAndUpdate({center_code:center_code,date:date},{slot:availSlot,totalvaccine:total,totalFirst:totalfirst})

    return res.status(200).send({status:true,msg:"your 1st dose vaccination Slot deleted successfully ",data:updateUser})

    }
catch(err){
    res.status(500).send({status:false,msg:err.message})
}
}

module.exports={creatuser,login,slotBook,slotDelete}