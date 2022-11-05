const mongoose = require('mongoose')
const schema = mongoose.Schema
const sc = mongoose.Schema({
    user : {
        required : true , 
        type : schema.Types.ObjectId ,
        ref : 'User'
    } ,
    cart : {
        required : true , 
        type : Object
    },
    nom : {
        required : true , 
        type : String , 
    } , 
    adresse : {
        required : true , 
        type : String , 
    },
    nomCart : {
        required : true , 
        type : String , 
    },
    numCart : {
        required : true , 
        type : Number , 
    },
    annee : {
        required : true , 
        type : Number , 
    },
    mois : {
        required : true , 
        type : Number , 
    },
    cvc : {
        required : true , 
        type : Number , 
    },
    Quantite : {
        required : true , 
        type : Number
    } ,
    TotalPrix : {
        required : true , 
        type : Number
    } 
})
module.exports = mongoose.model('order' , sc)