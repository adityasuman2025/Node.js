	var bcrypt = require('bcrypt');

//connecting to the mongo database
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/nodeauth');
	var db = mongoose.connection;

//user schema
	var UserSchema = mongoose.Schema(
	{
		username: 
		{
			type: String,
			index: true
		},
		password: 
		{
			type: String,
			required: true,
			bcrypt: true
		},
		name: 
		{
			type: String
		},
		email: 
		{
			type: String
		},
		profileimage: 
		{
			type: String
		}
	});

	var User = module.exports = mongoose.model('User', UserSchema);

//defining getUserByUsername function to login the user
	module.exports.comparePassword = function(password, hash, callback)
	{
		bcrypt.compare(password, hash, function(err, isMatch)
		{
			if(err) return callback(err);
			callback(null, isMatch);
		});
	}

	module.exports.getUserByUsername = function(username, callback)
	{
		var query = {username: username};
		User.findOne(query, callback);
	}

	module.exports.getUserById = function(id, callback)
	{
		User.findById(id, callback);
	}

//defining create user function to register the user
	module.exports.createUser = function(newUser, callback) 
	{
	//setting hash password
		bcrypt.hash(newUser.password, 10, function(err, hash)
		{
			if(err) throw err;
			newUser.password = hash;
		//create user
			newUser.save(callback);
		});	
	}