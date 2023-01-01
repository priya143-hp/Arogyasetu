const slotModel=require("../model/slotmodel")

const {isValidDate}=require("../util/validation")


const slots=async function(req,res){
  try { let data=req.body
     let {center,center_code,date}=data

     let newArr=["date","center","center_code"]
     for(i of newArr){
      if(!data[i])return res.status(400).send({status:false,msg:`${i} is mandatory please input ${i}`})
     }
    
    if(!isValidDate(date))return res.status(400).send({status:false,msg:"please put date in MM/DD/YYYY formate"})

    let oldCenter=await slotModel.findOne({center_code:center_code,date:date})
    if(oldCenter)return res.status(400).send({status:false,msg:"This vactination center already exist"})


    let createCenter=await slotModel.create(data)
    res.status(201).send({status:true,msg:"Register",data:createCenter})


}
catch(err){
    res.status(500).send({status:false,msg:err.message})
}
}

const getSlots=async function(req,res){
    try {
        let center=req.query
        if(center){
          if(center.hasOwnProperty("date"))
            {if(!isValidDate(center.date))return res.status(400).send({status:false,msg:"please put date in MM/DD/YYYY formate"})}

            const findCenter=await slotModel.find(center).select({totalvaccine:0,totalFirst:0,totalSecond:0})
            if(findCenter.length==0)return res.status(200).send({status:true,msg:"No data found with this query"})
            return res.status(200).send({status:true,data:findCenter})
        }

        const findCenter=await slotModel.find(center).select({totalvaccine:0,totalFirst:0,totalSecond:0})
        return res.status(200).send({status:true,data:findCenter})

    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
    }

    module.exports={slots,getSlots}