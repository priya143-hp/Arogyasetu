
const express=require("express")
const Router=express()
const {creatuser,login,slotBook,slotDelete}=require("../controller/usercontroller")
const {slots,getSlots}=require("../controller/slotcontroller")
const {userData}=require("../controller/admin")
const {authentication,authorization}= require("../auth/auth")

Router.post("/user",creatuser)
Router.post("/login",login)
Router.post("/user/:userId",authentication,authorization,slotBook)
Router.put("/user/:userId",authentication,authorization,slotDelete)


Router.post("/slot",slots)
Router.get("/slot",getSlots)

Router.get("/admin",userData)


Router.all("*/",(req,res)=>res.status(404).send({status:false,msg:"Not found"}))





module.exports=Router