const mongoose = require('mongoose')
const scpr = mongoose.Schema({
    prix : {
        type : Number ,
        required : true 
    } , 
    nom : {
        type : String , 
        required : true 
    } , 
    urlimage : {
        type : String , 
        required : true 
    } , 
    information : {
        required : true ,
        type : {
            desc : String ,
            
        }
    },
    Soussouscategorie : {
        type : String , 
        required : true 
    },
    souscategorie : {
        type : String , 
        required : true 
    },
    categorie : {
        type : String , 
        required : true 
    }
})
const model = mongoose.model('produit' , scpr)



module.exports = model