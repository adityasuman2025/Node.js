var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

var multer = require('multer');

//when user click on any post for getting its full details
	router.get('/show/:id', function(req, res, next) 
	{
	//getting that post by id
		var db = req.db;
		var posts = db.get('posts');
		posts.findOne({_id: req.params.id}, function(err, post) {
			res.render('show', {id: req.params.id, post: post});
		});
	});


//when user click on add comment button
	router.post('/addcomment', function(req, res, next) 
	{
	//getting input field values
		var name = req.body.name;
		var email = req.body.email;
		var body = req.body.body;		
		var postid = req.body.postid;
		var commentdate = new Date();

	//form validation
		req.checkBody('name', 'Name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('body', 'Body is required').notEmpty();

	//check errors
		var errors = req.validationErrors();

		if(errors) //if error is found then returning the user back to that post details page
		{
			var posts = db.get('posts');
			posts.findOne({_id: postid}, function(err, post) {
				res.render('show', {errors: errors, post: post});
			});	
		}
		else //if no error then inserting the comment into that post in the database
		{
		//inserting the comment into the database
			var comment = {name: name, email: email, body: body, date: commentdate};

			var posts = db.get('posts');//getting the collection
			posts.update({_id: postid}, {$push: {comments: comment}}, function(err, doc)
			{
				if(err)
				{
					throw err;
				}
				else
				{
					req.flash('success', 'Comment added');

					res.redirect('/posts/show/' + postid);
				}
			});
		}
	});

//when user click on add post tab
	router.get('/add', function(req, res, next) 
	{
		res.render('addpost', {title: "Add Post"});
	});

//when user click on save button
	var upload = multer({ dest: '/public/images/uploads'});

	router.post('/add', upload.single('mainimage'), function(req, res, next) 
	{
	//getting input field values
		var title = req.body.title;
		var category = req.body.category;
		var author = req.body.author;
		var body = req.body.body;		
		var date = new Date();

	//check the image field
		if(req.file)
		{
			console.log("file has been choosen");

		//uploaded file info
			var mainimageOriginalName = req.files.mainimage.originalname;
			var mainimageName = req.files.mainimage.name;
			var mainimageMime = req.files.mainimage.mimetype;
			var mainimagePath = req.files.mainimage.path;
			var mainimageExt = req.files.mainimage.extension;
			var mainimageSize = req.files.mainimage.size;
		}
		else
		{
			//setting a default image
			var mainimageName = "noimage.png";
		}

	//form validation
		req.checkBody('title', 'Title is required').notEmpty();
		req.checkBody('category', 'Category is required').notEmpty();
		req.checkBody('author', 'Author is required').notEmpty();
		req.checkBody('body', 'Body is required').notEmpty();

	//check errors
		var errors = req.validationErrors();

		if(errors) //if error is found then returning the user back to add post page
		{
			res.render('addpost', 
			{
				errors: errors,
				title: title,
				body: body
			});			
		}
		else //if no error then inserting the post details into the database
		{
		//inserting to the database
			var posts = db.get('posts');//getting the collection
			posts.insert(
			{
				title: title,
				category: category,
				author: author,
				body: body,
				date: date,
				mainimage: mainimageName
			}, function(err, post)
			{
				if(err)
				{
					res.send("Something went wrong in inserting post into the database");
				}
				else
				{
					req.flash('success', "Post Submitted");

				//redirecting the user back to the homepage
					res.location('/');
					res.redirect('/');
				}
			});
		}
	});

module.exports = router;
