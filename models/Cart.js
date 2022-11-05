const mongoose = require('mongoose')
const sc = mongoose.Schema({
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
    Produits : {
        required : true , 
        type : Array
    } ,
    createAt : {
        type : Date ,
        default : Date.now ,
        index : {expires : '20m'} 
    }
})
module.exports = mongoose.model('cart' , sc)