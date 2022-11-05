const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSc = mongoose.Schema({
    nom : {
        type : String
    } , 
    prenom : {
        type : String
    } , 
    adresse : {
        type : String
    } , 
    email : {
        required : true ,
        type : String
    } ,
    password : {
        required : true ,
        type : String
    } ,
   
    telephone : {
        type : Number
    } , 
    address : {
        type : String
    }
})

userSc.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password , this.password)
    }
const usermodel = mongoose.model('user' , userSc)
module.exports = usermodel