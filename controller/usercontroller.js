const userModel=require("../model/user")
const slotModel=require("../model/slotmodel")

const creatuser=async function(req,res){
    try{
        let data=req.body
      let {name,phone,password,Age,Pincode,Aadhar}=data



 const oldUser=await userModel.findOne({phone:phone}) 
 if(oldUser)return res.status(400).send({status:true,msg:"User already exist with this Mobile no"})      

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

       const login=await userModel.findOne({phone:phone})
       if(!login)return res.status(400).send({status:false,msg:"can't find any user with this mobile no"})
       if(login.password!=password)return res.status(400).send({status:false,msg:"Please enter a correct password"})
       
       let token=jwt.sign({userId:login._id},"secret")

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

 if(dose==1){
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
    const updateUser=await userModel.findOneAndUpdate({_id:userId},{first_dose:newObj},{new:true})

    //slot update in slot model

let updatedData={
    time:slot,
    quantity:(Vaccin_no-1)
}

availSlot.splice(index,1,updatedData)

await slotModel.findOneAndUpdate({center_code:center_code,date:date},{slot:availSlot})
return res.status(201).send({status:true,msg:"slot booked successfully",data:updateUser})
 }




 if(dose==2){
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
    
    availSlot.splice(index,1,updatedData)
    
    await slotModel.findOneAndUpdate({center_code:center_code,date:date},{slot:availSlot})

    return res.status(201).send({status:true,msg:"slot bool successfully",data:updateUser})
 }

    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}



const slotDelete=async function(req,res){
    try{
        
 let userId=req.params.userId
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
let diffTime = Math.abs(date2 - date1)/ (1000 * 60 * 60)
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

availSlot.splice(index,1,updateData)

await slotModel.findOneAndUpdate({center_code:center_code,date:date},{slot:availSlot})


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
let diffTime = Math.abs(date2 - date1)/ (1000 * 60 * 60)

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

availSlot.splice(index,1,updateData)

await slotModel.findOneAndUpdate({center_code:center_code,date:date},{slot:availSlot})

    return res.status(200).send({status:true,msg:"your 1st dose vaccination Slot deleted successfully ",data:updateUser})

    }
catch(err){
    res.status(500).send({status:false,msg:err.message})
}
}










module.exports={creatuser,login,slotBook,slotDelete}