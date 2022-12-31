const userModel=require("../model/user")

const creatuser=async function(req,res){
    try{
        let data=req.body

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
 let {dose,date,slot}=data

 if(dose==1){
    const user=await userModel.findById(userId)
    if(!user)return res.status(400).send({statusfalse,msg:"User not found"})

        //find slot

let newObj={
    status:true,
    slot:slot,
    date:date 
}
    const updateUser=await userModel.findOneAndUpdate({_id:userId},{first_dose:newObj},{new:true})

    //slot update

    return res.status(201).send({status:true,msg:"slot booked successfully",data:updateUser})
 }




 if(dose==2){
const user=await userModel.findById(userId)
if(!user)return res.status(400).send({statusfalse,msg:"User not found"})

if(user.first_dose.status==false)return res.status(400).send({status:false,msg:"you can not apply for 2nd dose"})


  //find slot



  let newObj={
    status:true,
    slot:slot,
    date:date 
}

const updateUser=await userModel.findOneAndUpdate({_id:userId},{second_dose:newObj},{new:true})


    //slot update

    return res.status(201).send({status:true,msg:"slot bool successfully",data:updateUser})
 }

    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

module.exports={creatuser,login,slotBook}