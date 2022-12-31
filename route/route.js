
const express=require("express")
const Router=express()
const {creatuser,login,slotBook}=require("../controller/usercontroller")

Router.post("/user",creatuser)
Router.post("/user/:userId",slotBook)









module.exports=Router