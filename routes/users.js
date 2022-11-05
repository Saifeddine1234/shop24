
var SousSousCat = require("../models/SousSousCat");
var SousCat = require("../models/SousCat");
var Order = require("../models/Order");

var express = require('express');
var router = express.Router();
const User = require('../models/User')
//const Order = require('../models/Order')
const bcrypt = require('bcrypt')
const csrf = require('csurf')
router.get("/login", function (req, res, next) {
  res.render("user/login.ejs", {
        title: "login"
      });
});

router.use(csrf())
var { check , validationResult } = require('express-validator');
const passport = require('passport');
router.get('/signup',isNotSignin, async function(req, res, next) {
  const messageserror = req.flash('error')
  const souscat = await SousCat.find((err, doc) => {
    if (!err) {
      console.log("done");
    } else {
      console.log(err);
    }
  });
  res.render('user/signup' , { title : "S’inscrire",souscat : souscat , messageserror : messageserror ,check : req.isAuthenticated() , token : req.csrfToken()})
});
router.post('/signup' , [ 
  check('email').not().isEmpty().withMessage('remplir le champ email !') ,
  check('email').isEmail().withMessage('remplir sous form email') ,
check('password').not().isEmpty().withMessage('remplir le champ de mot de passe !') ,
check('password').isLength({min : 6}).withMessage('tres court mot de passe ') ,
check('cpassword').custom((value , {req}) => {
if(value !== req.body.password){
  throw new Error('non confondu')
}
return true
})] , async (req , res , next) => {
  const errors = validationResult(req)
if(!errors.isEmpty()){
  var msg = []
for(var i = 0 ; i < errors.errors.length ; i++) {
msg.push(errors.errors[i].msg)
} 
console.log(msg)
req.flash('error' , msg)
res.redirect('/')
  return ;
}
next();
}, passport.authenticate('local-signup' , {
  session : false ,
  successRedirect : 'signin' ,
  failureRedirect : 'signup' ,
  failureMessage : true
}))

router.get('/signin',isNotSignin , async function(req, res, next) {
  const souscat = await SousCat.find((err, doc) => {
    if (!err) {
      console.log("done");
    } else {
      console.log(err);
    }
  });
  const error = req.flash('signinError')
  res.render('user/signin' , {title : "login",error : error , souscat : souscat , check : req.isAuthenticated() , token : req.csrfToken()})
});
router.post('/signin', passport.authenticate('local-signin' , {
  successRedirect:'/' ,
  failureRedirect : 'signin' ,
  failureFlash : true

}))
router.get('/profil', isSignin, async (req, res, next) => {
  const souscat = await SousCat.find((err, doc) => {
    if (!err) {
      console.log("done");
    } else {
      console.log(err);
    }
  });
  if(req.user.cart){
    QPr = req.user.cart.Quantite
  }else{
    QPr = 0
  }

  Order.find({user : req.user._id} , async (err , result)=>{
    if(err){
      console.log(err)
    }
    console.log(result)
var error = req.flash('errorprofil')
var haserrorprofil = false 
if(error.length > 0){
  haserrorprofil = true 

}
console.log(req.user)
const s = await User.findById({_id : req.user._id} , (err , result)=>{
  if(err){
    console.log(err)
  }
  console.log(result)
});
console.log(s)
  res.render('user/profil' ,{check : req.isAuthenticated() , souscat : souscat , user : s , haserrorprofil : haserrorprofil ,token : req.csrfToken() , error : error , QPr : QPr , order : result})
})
});

router.get('/logout' , (req , res , next) => {
  req.logOut()
  res.redirect('/user/signin')
  req.isAuthenticated
})
function isSignin(req ,res , next){
  if(!  req.isAuthenticated()){
    res.redirect('/user/signin')
    return;
  }
  next()
}
function isNotSignin(req ,res , next){
  if( req.isAuthenticated()){
    res.redirect('/')
    return;
  }
  next()
}

router.post('/updateuser' ,  [ 
  check('nom').not().isEmpty().withMessage('remplir le champ nom !') ,
  check('prenom').not().isEmpty().withMessage('remplir le champ prenom !') ,
  check('telephone').not().isEmpty().withMessage('remplir le champ numero !') ,
  check('adresse').not().isEmpty().withMessage('remplir le champ d adresse !') ,
check('password').not().isEmpty().withMessage('remplir le champ de mot de passe !') ,
check('password').isLength({min : 6}).withMessage('tres court mot de passe ') ,
] , async (req , res , next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    var msg = []
  for(var i = 0 ; i < errors.errors.length ; i++) {
  msg.push(errors.errors[i].msg)
  
  } 
  console.log(msg)
  req.flash('errorprofil' , msg)
  res.redirect('profil#contact')
  
    return 
     }else{
    console.log('modifier')
   var Newuser = {
      nom : req.body.nom ,
      password : bcrypt.hashSync( req.body.password , 10) ,
      prenom : req.body.prenom, 
      telephone : req.body.telephone, 
      adresse : req.body.adresse ,
  }
  User.updateOne({_id : req.user._id} , {$set : Newuser} , (err , doc) => {
if(err){
  console.log(err)
}else{
  console.log(doc)
  res.redirect('profil#contact')
}
  })
}
})

module.exports = router;
