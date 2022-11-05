var express = require("express");
var router = express.Router();
var SousSousCat = require("../models/SousSousCat");
var SousCat = require("../models/SousCat");
var Produit = require("../models/Produit");
var User = require("../models/User");
var Cart = require("../models/Cart");
var Order = require("../models/Order");

/*
var mongoose = require("mongoose");

var Cart = require("../models/Cart");
var Order = require("../models/Order");

*/
router.get("/admin",(req, res, next) => {
    res.render('admin/admin.ejs')
});
router.post("/soussouscategorie",(req, res, next) => {
  const soussouscat = new SousSousCat({
    categorie: req.body.categorie,
    souscategorie: req.body.souscategorie,
      soussouscategorie: req.body.soussouscategorie,

    });
    console.log(req.body.souscategorie)
    soussouscat.save((err, result) => {
      if (err) {
        console.log(err);
      }

      console.log(result);
      res.redirect("/admin/soussouscategorie");

    });
})
router.get("/souscategorie",(req, res, next) => {

        res.render('admin/ajoutersouscat.ejs'    )
})
router.get("/soussouscategorie",(req, res, next) => {
    
  SousCat.find((err, souscat) => {
    if (err) {
      console.log(err);
    } else {
        res.render('admin/ajoutersoussouscat.ejs' ,{ souscat : souscat      
          } )
    }
   })
  
})
router.get("/produit",(req, res, next) => {
    
  SousSousCat.find((err, soussouscat) => {
    if (err) {
      console.log(err);
    } else {
        res.render('admin/ajouterpr.ejs' ,{ soussouscat : soussouscat      
          } )
    }
   })
  
})

        
router.post("/souscategorie",(req, res, next) => {
        const souscat = new SousCat({
          categorie: req.body.categorie,
            souscategorie: req.body.souscategorie,

          });
          console.log(req.body.categorie)
          souscat.save((err, result) => {
            if (err) {
              console.log(err);
            }
    
            console.log(result);
            res.redirect("/admin/souscategorie");

          });
    
          });



          
router.get("/ajouterpr",(req, res, next) => {
    res.render('admin/ajouterpr.ejs')}
        )
router.post("/produit",(req, res, next) => {
  SousSousCat.findOne({ soussouscategorie : req.body.soussouscategorie } ,function(err, companies) {
    console.log(companies.souscategorie)

    const produit = new Produit({
      prix: req.body.prixproduit,
      nom: req.body.nomproduit,
      urlimage: req.body.urlproduit,
      information:{
         desc : req.body.descproduit,
      },
      categorie : companies.categorie,
      souscategorie : companies.souscategorie,
      Soussouscategorie : req.body.soussouscategorie ,
    });
    produit.save((err, result) => {
      if (err) {
        console.log(err);
      }

      console.log(result);
    });
  })

      res.redirect("/admin/admin");

      });
    
    router.get("/afficheSSC",(req, res, next) => {
        SousSousCat.find((
          err, produit) => {
         if (err) {
           console.log(err);
         } else {
             res.render('admin/affichesoussouscat.ejs' ,{ produit : produit} )
     
         }
        })
     });
     router.get("/afficheSC",(req, res, next) => {
      SousCat.find((
        err, produit) => {
       if (err) {
         console.log(err);
       } else {
           res.render('admin/affichesouscat.ejs' ,{ produit : produit} )
   
       }
      })
   });
     
   

router.get("/affichepr",(req, res, next) => {
   Produit.find((err, produit) => {
    if (err) {
      console.log(err);
    } else {
        res.render('admin/affichepr.ejs' ,{ produit : produit} )

    }
   })
});
router.get("/afficheuser",(req, res, next) => {
    User.find((err, user) => {
        if (err) {
          console.log(err);
        } else {
            console.log(user)
    res.render('admin/afficheuser.ejs',{ user : user}) }
        })

});
router.get("/statistique",(req, res, next) => {
    Order.find((err, order) => {
        if (err) {
          console.log(err);
        } else {
            console.log(order)
      
    res.render('admin/statistique.ejs' , {order : order})}
})
})

router.get("/supprimersouscat/:id" , (req , res , next )=> {
  const id = req.params.id
  var s = SousCat.deleteOne({_id : id} , (err , doc ) => {
      if(err){
          console.log(err) 
      }else {
          res.redirect('/admin/afficheSC')
      }
    })
    console.log(s)
  })
  router.get("/supprimersoussouscat/:id" , (req , res , next )=> {
    const id = req.params.id
    SousSousCat.deleteOne({_id : id} , (err , doc ) => {
        if(err){
            console.log(err) 
        }else {
            res.redirect('/admin/afficheSSC')
        }
      })
    })
router.get("/supprimerpr/:id" , (req , res , next )=> {
  const id = req.params.id
  Produit.deleteOne({_id : id} , (err , doc ) => {
      if(err){
          console.log(err) 
      }else {
          res.redirect('/admin/affichepr')
      }
    })
  })
router.get("/supprimerpr/:id" , (req , res , next )=> {
  const id = req.params.id
  Produit.deleteOne({_id : id} , (err , doc ) => {
      if(err){
          console.log(err) 
      }else {
          res.redirect('/admin/affichepr')
      }
    })
  })
router.get("/modifierpr/:id" , (req , res , next )=> {
  const id = req.params.id
  Produit.findById({_id : id}, (err, produit) => {
      if (err) {
        console.log(err);
      } else {
          console.log(produit)
res.render('admin/modifierpr.ejs' , {id : id , i : produit})
      }
})
})  
router.post("/modifierpr/modifierpr",(req, res, next) => {
  var produit={
      prix: req.body.prixproduit,
      nom: req.body.nomproduit,
      urlimage: req.body.urlproduit,
      information:{
         desc : req.body.descproduit,
       
      }
    }
    console.log(produit)
    
    Produit.updateOne({_id : req.body.id } , {$set : produit}, (err , result) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/admin/affichepr");
    });

    }); 
    router.get("/supprimeruser/:id" , (req , res , next )=> {
      const id = req.params.id
      User.deleteOne({_id : id} , (err , doc ) => {
          if(err){
              console.log(err) 
          }else {
              res.redirect('/admin/afficheuser')
          }
      })
  })
  router.get("/supprimercommande/:id" , (req , res , next )=> {
    const id = req.params.id
    Order.deleteOne({_id : id} , (err , doc ) => {
        if(err){
            console.log(err) 
        }else {
            res.redirect('/admin/affichecommandes')
        }
    })
})
router.get("/affichecommandes",(req, res, next) => {
    Order.find((err, order) => {
        if (err) {
          console.log(err);
        } else {
            console.log(order)
    res.render('admin/affichecommandes.ejs' , {order : order})}
        })})


  
   /*     

}})})

router.get("/ajouterpr",(req, res, next) => {
    res.render('admin/ajouterpr.ejs')}
        )
router.post("/ajouterpr",(req, res, next) => {
    const produit = new Produit({
        prix: req.body.prixproduit,
        nom: req.body.nomproduit,
        urlimage: req.body.urlproduit,
        information:{
           capacite : req.body.capacite,
            sim: req.body.sim,
            ram: req.body.ram,
        }
      });
      produit.save((err, result) => {
        if (err) {
          console.log(err);
        }

        console.log(result);
      });
      res.redirect("/a/affichepr");

      });
      router.post("/modifierpr/modifierpr",(req, res, next) => {
        var produit={
            prix: req.body.prixproduit,
            nom: req.body.nomproduit,
            urlimage: req.body.urlproduit,
            information:{
               capacite : req.body.capacite,
                sim: req.body.sim,
                ram: req.body.ram,
            }
          }
          
          Produit.updateOne({_id : req.body.id } , {$set : produit}, (err , result) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/a/affichepr");
            console.log(result);
          });
    
          });
          */


module.exports = router;
