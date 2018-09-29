var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');

var User = require('../models/user');

/* GET users listing. */
	router.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});

//when user clicks on register page
	router.get('/register', function(req, res, next) {
		res.render('register', {title: 'Register'});
	});

//when user clicks on login page
	router.get('/login', function(req, res, next) {
		res.render('login', {title: 'Login'});
	});

//when user clicks on register button
	var upload = multer({ dest: './uploads' });

	router.post('/register', upload.single('profileimage'), function(req, res, next) 
	{
	//getting the variables
		var name = req.body.name;
		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;

	//check the image field
		if(req.file)
		{
			console.log("file has been choosen");

		//uploaded file info
			var profileImageOriginalName = req.files.profileimage.originalname;
			var profileImageName = req.files.profileimage.name;
			var profileImageMime = req.files.profileimage.mimetype;
			var profileImagePath = req.files.profileimage.path;
			var profileImageExtension = req.files.profileimage.extension;
			var profileImageSize = req.files.profileimage.size;
		}
		else
		{
			//setting a default image
			var profileImageName = "noimage.png"
		}

	//form validation
		req.checkBody('name', 'Name field is required').notEmpty();
		req.checkBody('email', 'Email field is required').notEmpty();
		req.checkBody('email', 'Not a valid email').isEmail();
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();

	//check for errors
		var errors = req.validationErrors();

		if(errors) //if error is found then returning user back to the register page
		{
			res.render('register', 
			{
				errors: errors,
				name: name,
				email: email,
				username: username,
				password: password
			});
		}
		else //no errors then creating the user
		{
			var newUser = new User({
				name: name,
				email: email,
				username: username,
				password: password,
				profileimage: profileImageName
			});

		//create user
			User.createUser(newUser, function(err, user) 
			{
				if(err) throw err;
				console.log(user);
			});

		//success message
			req.flash('success', 'You are now registered and may log in');

			res.location('/');
			res.redirect('/');
		}
	});

//when clicked on login button
	passport.serializeUser(function(user, done)
	{
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done)
	{
		User.getUserById(id, function(err, user)
		{
			done(err, user);
		});
	});

	passport.use(new LocalStrategy
	(
		function(username, password, done)
		{
			User.getUserByUsername(username, function(err, user) 
			{
				if(err) throw err;
				if(!user)
				{
					console.log('Unknown User');
					return done(null, false, {message: 'Unknown user'});
				}

				User.comparePassword(password, user.password, function(err, isMatch) 
				{
					if(err) throw err;
					if (isMatch)
					{
						return done(null, user);
					}
					else
					{
						console.log("Invalid Password");
						return done(null, false, {message: "Invalid Password"});
					}
				});
			});
		}
	));

	router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function(req, res)
	{
		console.log('authentication succeed');
		req.flash('success', 'You are logged in');
		res.redirect('/');
	});

//on clicking on logout button
	router.get('/logout', function(req, res) {
		req.logout();
		console.log("successfully logged out");
		req.flash('success', 'You have logged out.');
		res.redirect('/users/login');
	})

module.exports = router;
