const mongoose = require('mongoose')
const sc = mongoose.Schema({ 
  
    categorie : {
        type : String , 
    }, 
    souscategorie : {
        type : String , 
    },
})
const model = mongoose.model('souscat' , sc)
module.exports = model ;