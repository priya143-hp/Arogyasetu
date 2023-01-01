const userModel=require("../model/user")
const slotModel=require("../model/slotmodel")

const userData=async function(req,res){
    try{
    let data=req.query
   
    const userDetails=await userModel.find(data)

    if(data.hasOwnProperty("second") && data.hasOwnProperty("first")){
        if(data.second=="true"){data.second=true}
        else{data.second=false}
        if(data.first=="true"){data.first=true}
        else{data.first=false}
        let newData=userDetails.filter(x=>x.second_dose.status==data.second)
        let newData1=newData.filter(x=>x.first_dose.status==data.first)
        return res.status(200).send({sta:true,msg:`${newData1.length} people found with this query`,data:newData1})
    }

    if(data.hasOwnProperty("second")){
        if(data.second=="true"){data.second=true}
        else{data.second=false}
        let newData=userDetails.filter(x=>x.second_dose.status==data.second)
       return res.status(200).send({sta:true,msg:`${newData.length} people found with this query`,data:newData})
       }

if(data.hasOwnProperty("first")){
    if(data.first=="true"){data.first=true}
    else{data.first=false}

    console.log(data)
 let newData=userDetails.filter(x=>x.first_dose.status==data.first)
return res.status(200).send({sta:true,msg:`${newData.length} people found with this query`,data:newData})
}




    res.status(200).send({sta:true,msg:`${userDetails.length} people found with this query`,data:userDetails})
    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}



const slotData=async function(req,res){
    try{

let data=req.body
let query=req.query
const slots=await slotModel.find(data)

if(query.hasOwnProperty("second") && query.hasOwnProperty("first")){
let total=0
let first=0
let second=0

for(i=0;i<slots.length;i++){
    total+= 1400-slots[i].totalvaccine
    first+=first+slots[i].totalFirst
    second+=second+slots[i].totalSecond
}

return res.status(200).send({status:true,data:`total vaccin taken=${total}   total 1st dose taken ${first} total 2nd dose taken ${second}`})
}


if(query.hasOwnProperty("second")){
    let second=0 
    for(i=0;i<slots.length;i++){
        second+=second+slots[i].totalSecond
    }
    
    return res.status(200).send({status:true,data:`total 2nd dose taken ${second}`})
    }
    if(query.hasOwnProperty("first")){
        let first=0
        for(i=0;i<slots.length;i++){
     
            first+=first+slots[i].totalFirst

        }
        
        return res.status(200).send({status:true,data:`total 1st dose taken ${first}`})
        }



    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}





module.exports={userData,slotData}