var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').strategy;


var User = require('../models/user')

router.get('/register', function(req,res){

		res.render('register');


});

router.get('/login', function(req,res){

		res.render('login');


});

router.post ('/register', function(req,res){

		var name = req.body.name;
		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;
		var password = req.body.password2;

req.checkBody('password2','Password do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){

		res.render('user/register',{

			errors:errors
		});
	}
	else{

		var newUser = new User({

			name : name,
			email: email,
			username: username,
			password : password

		});

		User.createUser(newUser , function(err , user){

			if(err) throw err ;
			console.log(user);
		});

		req.flash('success_msg',"you are successfully register");

		res.redirect('/users/login');
	}
});

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    
  User.getUserByUsername(username , function(err,user){

  	if(err) throw err;
  	if(!user){

  		return done(null , false , {message :'unknown User'});
  	}
  		User.comparePassword(password, user.password , function(err , isMatch){
  
 				if(err) throw err;
 				if(isMatch){
 					return done (null , user);
 				} else{

 					return done (null , false , {message :'Invalid password'});
 				}


  		});


  });



  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});




router.post('/login',
  passport.authenticate('local',{ successRedirect:'/',failureRedirect:'/users/login',failureFlash : true}),
  function(req, res) {
    
    	res.redirect('/index');
    	req.flash('success_msg',"you are successfully login");
  });

module.exports = router;