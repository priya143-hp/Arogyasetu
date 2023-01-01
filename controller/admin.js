const userModel=require("../model/user")

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

module.exports={userData}