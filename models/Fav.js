const mongoose = require('mongoose')
const fav = mongoose.Schema({
    _id : {
        required : true , 
        type : String
    } ,
    Quantite : {
        required : true , 
        type : Number
    } ,
    TotalPrix : {
        required : true , 
        type : Number
    } ,
    Favs : {
        required : true , 
        type : Array
    } ,
    
})
module.exports = mongoose.model('fav' , fav)