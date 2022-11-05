var express = require("express");
const app = require("../app");
var router = express.Router();
//var mongoose = require("mongoose");
var Produit = require("../models/Produit");
var SousSousCat = require("../models/SousSousCat");
var Order = require("../models/Order");

var SousCat = require("../models/SousCat");
var { check, validationResult } = require("express-validator");
var Cart = require("../models/Cart");
var Fav = require("../models/Fav");
//var Order = require("../models/Order");
router.get("/", async function (req, res, next) {
  var QPr = 0;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      QPr = req.user.cart.Quantite;
    } else {
      QPr = 0;
    }
  }
  const souscat = await SousCat.find((err, doc) => {
    if (!err) {
      console.log("done");
    } else {
      console.log(err);
    }
  });
  const pr = await Produit.find((err, doc) => {
    if (!err) {
      console.log("done");
    } else {
      console.log(err);
    }
 
  });

  res.render("home.ejs", {
        title: "Home" , 

    QPr: QPr,
    produits : pr , 
    souscat : souscat , 
        check: req.isAuthenticated(),

      });
});
router.get("/panier", async (req, res, next) => {
  const souscat = await SousCat.find((err, doc) => {
    if (!err) {
      console.log("done");
    } else {
      console.log(err);
    }
  });
  var QPr = null;
  if (!req.isAuthenticated()) {
    res.redirect("/user/signin");
  } else {
    if (!req.user.cart) {
      QPr = 0;
      res.render("card.ejs", {
        check: req.isAuthenticated(),
        message: "panier vide",
        souscat : souscat,  
       cart: req.user.cart,
        QPr: '0',

      });
    } else {
      QPr = req.user.cart.Quantite;
    }
  }
  res.render("card.ejs", {
    title: "Panier",
    check: req.isAuthenticated(),
    QPr: QPr,
    souscat : souscat,  

    cart: req.user.cart,
  });
});


router.get("/description/:id", async (req, res, next) => {
  const souscat = await SousCat.find((err, doc) => {
    if (!err) {
      console.log("done");
    } else {
      console.log(err);
    }
  });
  Produit.findOne({ _id : req.params.id } ,function(err, produits) {
    if (!err) {
      var QPr = null;
      if (!req.isAuthenticated()) {
        res.redirect("/user/signin");
      } else {
        if (!req.user.cart) {
          QPr = 0;
          res.render("desc.ejs", {
            check: req.isAuthenticated(),
            souscat : souscat,  
            produits: produits ,
           cart: req.user.cart,
            QPr: '0',
    
          });
        } else {
          QPr = req.user.cart.Quantite;
        }
      }
      res.render("desc.ejs", {
        produits: produits ,
        souscat :souscat , 
        check: req.isAuthenticated(),
       // successMes: successMes,
        QPr: QPr,
      });
        
    } else {
      console.log(err);
    }
  });
 
}
    )


    router.get("/add/:id/:prix/:nom/:urlimage", function (req, res, next) {
      console.log(req.params.id);
      console.log(req.params.prix);
      const cardId = req.user._id;
      const produitss = {
        ID: req.params.id,
        prix: req.params.prix,
        nom: req.params.nom,
        urlimage: req.params.urlimage,
        quantitee: 1,
      };
      Cart.findById(cardId, (err, cart) => {
        if (err) {
          console.log(err);
        } else {
          if (!cart) {
            const newCart = new Cart({
              _id: cardId,
              Quantite: 1,
              TotalPrix: parseFloat(req.params.prix , 10),
              Produits: [produitss],
            });
    
            newCart.save((err, doc) => {
              if (err) {
                console.log(err);
              } else {
                console.log(cart);
                // console.log(produitss)
              }
            });
          }
          if (cart) {
            var indexPr = -1;
            for (var i = 0; i < cart.Produits.length; i++) {
              if (req.params.id === cart.Produits[i]._id) {
                indexPr = i;
                break;
              }
            }
            if (indexPr >= 0) {
              console.log("b");
            } else {
              cart.Quantite = cart.Quantite + 1;
              cart.TotalPrix = cart.TotalPrix + parseFloat(req.params.prix , 10);
              

              cart.Produits.push(produitss);
              Cart.updateOne({ _id: cardId }, { $set: cart }, (err, doc) => {
                if (err) {
                  console.log(err);
                }
                console.log(doc);
                console.log(cart.Produits);
              });
            }
          }
        }
      });
      Produit.findById(req.params.id, (err, cart) => {
        res.redirect("/"+cart.categorie)
      })
    });






















    router.get("/favorite/:id/:prix/:nom/:urlimage", function (req, res, next) {
      console.log(req.params.id);
      console.log(req.params.prix);
      const cardId = req.user._id;
      const produitss = {
        ID: req.params.id,
        prix: req.params.prix,
        nom: req.params.nom,
        urlimage: req.params.urlimage,
        quantitee: 1,
      };
      Fav.findById(cardId, (err, cart) => {
        if (err) {
          console.log(err);
        } else {
          if (!cart) {
            const newCart = new Fav({
              _id: cardId,
              Quantite: 1,
              TotalPrix: parseFloat(req.params.prix , 10),
              Favs: [produitss],
            });
    
            newCart.save((err, doc) => {
              if (err) {
                console.log(err);
              } else {
                console.log(cart);
                // console.log(produitss)
              }
            });
          }
          if (cart) {
            var indexPr = -1;
            for (var i = 0; i < cart.Favs.length; i++) {
              if (req.params.id === cart.Favs[i]._id) {
                indexPr = i;
                console.log("a");

                break;
              }
            }
            if (indexPr >= 0) {
              console.log("b");
            } else {
              console.log("c");

              cart.Quantite = cart.Quantite + 1;
              cart.TotalPrix = cart.TotalPrix + parseFloat(req.params.prix , 10);
          
          
              

              cart.Favs.push(produitss);
              Fav.updateOne({ _id: cardId }, { $set: cart }, (err, doc) => {
                if (err) {
                  console.log(err);
                }
                console.log(doc);
                console.log(cart.Favs);
              });
            }
          }
        }
      });
      Produit.findById(req.params.id, (err, cart) => {
        res.redirect("/"+cart.categorie)
      })
    });












    router.get("/passer", (req, res, next) => {
      const messageserror = req.flash('error')
      const QPr = req.user.cart.Quantite;
      res.render("cpanierespece.ejs", {
        title: "passer commande",
        check: true,
        quantite: QPr,
        pt: req.user.cart.TotalPrix,
        messageserror : messageserror 
      
      });
    });
    
    
    router.post( "/passer", [
        check("nom").not().isEmpty().withMessage("remplir le champ nom !"),
        check("adresse").not().isEmpty().withMessage("remplir le champ adresse !"),
    
      ], 
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          var msg = [];
          for (var i = 0; i < errors.errors.length; i++) {
            msg.push(errors.errors[i].msg);
          }
          console.log(msg);
          req.flash("error", msg);
          res.redirect('passer')
          return ;
        }
          req.flash("success", "commande passer avec succes");
          const order = new Order({
            user: req.user._id ,
            cart: req.user.cart,
            nom: req.body.nom,
            adresse: req.body.adresse,
            nomCart:'0',
            numCart: 0.0,
            annee: 0,
            mois:0,
            cvc: 0,
            Quantite: req.user.cart.Quantite,
            TotalPrix: req.user.cart.TotalPrix,
          });
          console.log('11111111111111')
          order.save((err, result) => {
            if (err) {
              console.log(err);
            }
    
            console.log(result);
          });
          Cart.deleteOne({ _id: req.user.cart._id }, (err, doc) => {
            if (err) {
              console.log(err);
            }
            console.log("ok");
            res.redirect("/");
          });
        }
    );




    router.get("/passerC", (req, res, next) => {
      const messageserror = req.flash('error')
      const QPr = req.user.cart.Quantite;
      res.render("cpanier.ejs", {
        title: "passer commande",
        check: true,
        quantite: QPr,
        pt: req.user.cart.TotalPrix,
        messageserror : messageserror 
      
      });
    });
    
    
    router.post( "/passerC", [
        check("nom").not().isEmpty().withMessage("remplir le champ nom !"),
        check("adresse").not().isEmpty().withMessage("remplir le champ adresse !"),
        check("bank").not().isEmpty().withMessage("remplir le champ de Banque!"),
        check("bank").isLength({ min: 3 }).withMessage("tres court nom "),
        check("numCart")
          .isLength({ min: 14, max: 14 })
          .withMessage("sasir 14 chiffres "),
        check("annee")
          .isLength({ min: 2, max: 2 })
          .withMessage("sasir deux chiffres d annee d experation"),
        check("mois")
          .isLength({ min: 2, max: 2 })
          .withMessage("sasir deux chiffres de mois d experation"),
        check("cvc")
          .isLength({ min: 3, max: 3 })
          .withMessage("sasir 3 chiffres de CVC"),
          check('mois').custom((value , {req}) => {
            if(value > 31){
              throw new Error('mois incorrect')
            }
            return true
            }),
            check('annee').custom((value2 , {req}) => {
              if(value2 <= 20){
                throw new Error('year incorrect')
              }
              return true
              })
      ], 
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          var msg = [];
          for (var i = 0; i < errors.errors.length; i++) {
            msg.push(errors.errors[i].msg);
          }
          console.log(msg);
          req.flash("error", msg);
          res.redirect('passerC')
          return ;
        }
          req.flash("success", "commande passer avec succes");
          const order = new Order({
            user: req.user._id ,
            cart: req.user.cart,
            nom: req.body.nom,
            adresse: req.body.adresse,
            nomCart: req.body.bank,
            numCart: req.body.numCart,
            annee: req.body.annee,
            mois: req.body.mois,
            cvc: req.body.cvc,
            Quantite: req.user.cart.Quantite,
            TotalPrix: req.user.cart.TotalPrix,
          });
          order.save((err, result) => {
            if (err) {
              console.log(err);
            }
    
            console.log(result);
          });
          Cart.deleteOne({ _id: req.user.cart._id }, (err, doc) => {
            if (err) {
              console.log(err);
            }
            console.log("ok");
            res.redirect("/");
          });
        }
    );




    
    router.get("/favorite", async  function (req, res, next){
      var s = [];
      var QPr = 0;
      const souscat = await SousCat.find((err, doc) => {
        if (!err) {
          console.log("done");
        } else {
          console.log(err);
        }
      });
      
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      QPr = req.user.cart.Quantite;
    } else {
      QPr = 0;
    }
  }
      if (!req.isAuthenticated()) {
        res.redirect("/user/signin");
      } else {
      
        
        const cardId = req.user._id;
        Fav.findById(cardId ,(err, cart) => {


          res.render("favorite.ejs", {
            check: req.isAuthenticated(),
            cart : cart,
            souscat : souscat ,
            QPr: QPr,

          });
        })
      }})



    router.get("/delete/:index", (req, res, next) => {
      const index = req.params.index;
      const cart = req.user.cart;
      if (cart.Produits.length <= 1) {
        Cart.deleteOne({ _id: cart._id }, (err, doc) => {
          if (err) {
            console.log(err);
          }
          console.log(doc);
          res.redirect("/panier");
        });
      } else {
        cart.Quantite = cart.Quantite - 1;
        cart.TotalPrix = cart.TotalPrix - cart.Produits[index].prix;
        cart.Produits.splice(index, 1);
        const cardId = cart._id;
        Cart.updateOne({ _id: cardId }, { $set: cart }, (err, doc) => {
          if (err) {
            console.log(err);
          }
          console.log(doc);
          console.log(cart);
          res.redirect("/panier");
        });
      }
    });
    router.get("/deletefav/:index", (req, res, next) => {
      const index = req.params.index;
      const cart = cart;
      
      if (cart.Favs.length <= 1) {
        Fav.deleteOne({ _id: cart._id }, (err, doc) => {
          if (err) {
            console.log(err);
          }
          console.log(doc);
          res.redirect("/panier");
        });
      } else {
        cart.Quantite = cart.Quantite - 1;
        cart.TotalPrix = cart.TotalPrix - cart.Favs[index].prix;
        cart.Favs.splice(index, 1);
        const cardId = cart._id;
        Fav.updateOne({ _id: cardId }, { $set: cart }, (err, doc) => {
          if (err) {
            console.log(err);
          }
          console.log(doc);
          console.log(cart);
          res.redirect("/panier");
        });
      }
    });








    router.get("/:id", async function (req, res, next) {
      const successMes = req.flash("success")[0];
      var QPr = 0;
      if (req.isAuthenticated()) {
        if (req.user.cart) {
          QPr = req.user.cart.Quantite;
        } else {
          QPr = 0;
        }
      }

      const soussouscat = await SousSousCat.find((err, doc) => {
        if (!err) {
          console.log("done");
        } else {
          console.log(err);
        }
      });
      const souscat = await SousCat.find((err, doc) => {
        if (!err) {
          console.log("done");
        } else {
          console.log(err);
        }
      });
      
      let s = req.params.id.replace(" ", "");
      const pr = await Produit.find({ categorie : req.params.id },(err, doc) => {
        if (!err) {
          console.log("done");

        } else {
          console.log(err);
        }
      });
console.log(pr.length)
  var cat = req.params.id ;
  res.render("medicament.ejs", {
    cat :  cat,
    length : pr.length,
    produits: pr,
    soussouscat : soussouscat ,
    souscat : souscat ,
vide : 'vide' ,
    
    check: req.isAuthenticated(),
    successMes: successMes,
    QPr: QPr,
  });
    
    });
    
   
  
     
        
        //});
    router.get("/:id/:sousc/:soussousc", async function (req, res, next) {
      const successMes = req.flash("success")[0];
      var QPr = 0;
      if (req.isAuthenticated()) {
        if (req.user.cart) {
          QPr = req.user.cart.Quantite;
        } else {
          QPr = 0;
        }
      }
      const soussouscat = await SousSousCat.find((err, doc) => {
        if (!err) {
          console.log("done");
        } else {
          console.log(err);
        }
      });
      const souscat = await SousCat.find((err, doc) => {
        if (!err) {
          console.log("done");
        } else {
          console.log(err);
        }
      });
      let s = req.params.id.replace(" ", "");
      console.log(s.length)
      const pr = await Produit.find({ categorie : req.params.id , souscategorie : req.params.sousc ,Soussouscategorie : req.params.soussousc },(err, doc) => {
        if (!err) {
          console.log("done");
    
        } else {
          console.log(err);
        }
      });
      var cat = req.params.id ;
      res.render("medicamentsss.ejs", {
        cat :  cat,
        sousc: req.params.sousc ,
        soussousc : req.params.soussousc,
        length : pr.length,
        produits: pr,
        soussouscat : soussouscat ,
        souscat : souscat ,
    
        
        check: req.isAuthenticated(),
        successMes: successMes,
        QPr: QPr,
      });
    });
    
    
    
    
    
   
    
    
    
    router.get("/:id/:sousc/", async function (req, res, next) {
      const successMes = req.flash("success")[0];
      var QPr = 0;
      if (req.isAuthenticated()) {
        if (req.user.cart) {
          QPr = req.user.cart.Quantite;
        } else {
          QPr = 0;
        }
      }
      const soussouscat = await SousSousCat.find((err, doc) => {
        if (!err) {
          console.log("done");
        } else {
          console.log(err);
        }
      });
      const souscat = await SousCat.find((err, doc) => {
        if (!err) {
          console.log("done");
        } else {
          console.log(err);
        }
      });
      let s = req.params.id.replace(" ", "");
      console.log(s.length)
      const pr = await Produit.find({ categorie : req.params.id , souscategorie : req.params.sousc },(err, doc) => {
        if (!err) {
          console.log("done");
    
        } else {
          console.log(err);
        }
      });
      var cat = req.params.id ;
      res.render("medicamentss.ejs", {
        cat :  cat,
        sousc: req.params.sousc ,
        length : pr.length,
        produits: pr,
        soussouscat : soussouscat ,
        souscat : souscat ,
    
        
        check: req.isAuthenticated(),
        successMes: successMes,
        QPr: QPr,
      });
    });
    
    
    
    
    
   
    
    
    
    
/*
var { check, validationResult } = require("express-validator");
mongoose.connect("mongodb://localhost/sc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("connect to DB"));
mongoose.connection.on("error", (error) => console.log(error));
router.get("/", async function (req, res, next) {
  const successMes = req.flash("success")[0];
  var QPr = 0;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      QPr = req.user.cart.Quantite;
    } else {
      QPr = 0;
    }
  }
  const pr = await Produit.find((err, doc) => {
    if (!err) {
      console.log("done");
    } else {
      console.log(err);
    }
  });
  res.render("index.ejs", {
    title: "Accueil",
    produits: pr,
    check: req.isAuthenticated(),
    successMes: successMes,
    QPr: QPr,
  });
});

router.get("/signup", function (req, res, next) {
  res.render("user/signup.ejs");
});
router.get("/success", function (req, res, next) {
  res.render("success.ejs");
});


router.get("/add/:id/:prix/:nom", function (req, res, next) {
  console.log(req.params.id);
  console.log(req.params.prix);
  const cardId = req.user._id;
  const produitss = {
    ID: req.params.id,
    prix: req.params.prix,
    nom: req.params.nom,
    quantitee: 1,
  };
  Cart.findById(cardId, (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      if (!cart) {
        const newCart = new Cart({
          _id: cardId,
          Quantite: 1,
          TotalPrix: parseInt(req.params.prix, 10),
          Produits: [produitss],
        });

        newCart.save((err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log(cart);
            // console.log(produitss)
          }
        });
      }
      if (cart) {
        var indexPr = -1;
        for (var i = 0; i < cart.Produits.length; i++) {
          if (req.params.id === cart.Produits[i]._id) {
            indexPr = i;
            break;
          }
        }
        if (indexPr >= 0) {
          console.log("b");
        } else {
          cart.Quantite = cart.Quantite + 1;
          cart.TotalPrix = cart.TotalPrix + parseInt(req.params.prix, 10);
          cart.Produits.push(produitss);
          Cart.updateOne({ _id: cardId }, { $set: cart }, (err, doc) => {
            if (err) {
              console.log(err);
            }
            console.log(doc);
            console.log(cart);
          });
        }
      }
    }
  });
  res.redirect("/");
});

router.get("/panier", (req, res, next) => {
  var QPr = null;
  if (!req.isAuthenticated()) {
    res.redirect("/users/signup");
  } else {
    if (!req.user.cart) {
      QPr = 0;
      res.render("panier.ejs", {
        title: "Panier",
        check: req.isAuthenticated(),
        message: "panier vide",
        cart: req.user.cart,
      });
    } else {
      QPr = req.user.cart.Quantite;
    }
  }
  res.render("panier.ejs", {
    title: "Panier",
    check: req.isAuthenticated(),
    QPr: QPr,
    cart: req.user.cart,
  });
});

router.get("/delete/:index", (req, res, next) => {
  const index = req.params.index;
  const cart = req.user.cart;
  if (cart.Produits.length <= 1) {
    Cart.deleteOne({ _id: cart._id }, (err, doc) => {
      if (err) {
        console.log(err);
      }
      console.log(doc);
      res.redirect("/panier");
    });
  } else {
    cart.Quantite = cart.Quantite - 1;
    cart.TotalPrix = cart.TotalPrix - cart.Produits[index].prix;
    cart.Produits.splice(index, 1);
    const cardId = cart._id;
    Cart.updateOne({ _id: cardId }, { $set: cart }, (err, doc) => {
      if (err) {
        console.log(err);
      }
      console.log(doc);
      console.log(cart);
      res.redirect("/panier");
    });
  }
});

router.get("/passerC", (req, res, next) => {
  const messageserror = req.flash('error')
  const QPr = req.user.cart.Quantite;
  res.render("cpanier.ejs", {
    title: "passer commande",
    check: true,
    quantite: QPr,
    pt: req.user.cart.TotalPrix,
    messageserror : messageserror 
  
  });
});

router.post(
  "/passerC",
  [
    check("nom").not().isEmpty().withMessage("remplir le champ nom !"),
    check("adresse").not().isEmpty().withMessage("remplir le champ adresse !"),
    check("bank").not().isEmpty().withMessage("remplir le champ de Banque!"),
    check("bank").isLength({ min: 3 }).withMessage("tres court nom "),
    check("numCart")
      .isLength({ min: 14, max: 14 })
      .withMessage("sasir 14 chiffres "),
    check("annee")
      .isLength({ min: 2, max: 2 })
      .withMessage("sasir deux chiffres d annee d experation"),
    check("mois")
      .isLength({ min: 2, max: 2 })
      .withMessage("sasir deux chiffres de mois d experation"),
    check("cvc")
      .isLength({ min: 3, max: 3 })
      .withMessage("sasir 3 chiffres de CVC"),
      check('mois').custom((value , {req}) => {
        if(value > 31){
          throw new Error('mois incorrect')
        }
        return true
        }),
        check('annee').custom((value2 , {req}) => {
          if(value2 <= 20){
            throw new Error('year incorrect')
          }
          return true
          })
  ], 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var msg = [];
      for (var i = 0; i < errors.errors.length; i++) {
        msg.push(errors.errors[i].msg);
      }
      console.log(msg);
      req.flash("error", msg);
      res.redirect('passerC')
      return ;
    }
      req.flash("success", "commande passer avec succes");
      const order = new Order({
        user: req.user._id ,
        cart: req.user.cart,
        nom: req.body.nom,
        adresse: req.body.adresse,
        nomCart: req.body.bank,
        numCart: req.body.numCart,
        annee: req.body.annee,
        mois: req.body.mois,
        cvc: req.body.cvc,
        Quantite: req.user.cart.Quantite,
        TotalPrix: req.user.cart.TotalPrix,
      });
      order.save((err, result) => {
        if (err) {
          console.log(err);
        }

        console.log(result);
      });
      Cart.deleteOne({ _id: req.user.cart._id }, (err, doc) => {
        if (err) {
          console.log(err);
        }
        console.log("ok");
        res.redirect("/");
      });
    }
);

//});


*/
module.exports = router;
