
const mongoose= require("mongoose")
const moment= require("moment")
//=========================================VALIDATIONS=====================================================//
const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)}

    const isValidString = (String) => {
        return /\d/.test(String)
      }

      
  const isValidPincode = (num) => {
    return /^[0-9]{6}$/.test(num);
  }
  
  const isValidPhone = (Mobile) => {
    return /^[6-9]\d{9}$/.test(Mobile)
  }

    
  const isValidPswd = (Password) => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)
  }

  const isValidDate = function (date) {
    if (typeof date != "string") return false
    return moment(date, 'MM/DD/YYYY', true).isValid()
  }

  module.exports={isValidObjectId,isValidPincode ,isValidString,isValidPhone,isValidPswd,isValidDate}