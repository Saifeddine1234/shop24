const mongoose = require('mongoose')
const sc = mongoose.Schema({ 
  
    categorie : {
        type : String , 
    }, 
    souscategorie : {
        type : String , 
    },
    soussouscategorie : {
        type : String , 
    },
})
const model = mongoose.model('soussouscat' , sc)
module.exports = model ;