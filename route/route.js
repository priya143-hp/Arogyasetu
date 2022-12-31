
const express=require("express")
const Router=express()
const {creatuser,login,slotBook,slotDelete}=require("../controller/usercontroller")
const {slots,getSlots}=require("../controller/slotcontroller")



Router.post("/user",creatuser)
Router.post("/user",login)
Router.post("/user/:userId",slotBook)
Router.put("/user/:userId",slotDelete)


Router.post("/slot",slots)
Router.get("/slot",getSlots)








module.exports=Router