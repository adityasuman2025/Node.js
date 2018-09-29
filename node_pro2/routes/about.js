var express = require('express');
var router = express.Router();
var express = require('express');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about', { title: 'About' });
});

router.post('/send', function(req, res, next) {
  var transporter = nodemailer.createTransport({
  	service: 'Gmail',
  	auth: {
  		user : "adityasuman@gmail.com",
  		pass: '1980AMS{4534&MNgo}'
  	}
  });

  var mailOptions = {
  	from: 'Aditya Suman <mngoscience@gmail.com>',
  	to: 'aditya.me16@iitp.ac.in',
  	subject: 'hello world',
  	text: 'Hello bro, How r u doing. You got message from \n Name: ' + req.body.name + ' \n Email: ' + req.body.email + ' \n Message: '
  	+ req.body.message,
  	html : '<p>You have got following details</p> <ul><li>Name: ' + req.body.name + ' </li><li>Email: ' + req.body.email + ' </li><li>Message: ' + req.body.message + ' </li><ul>'
  };

  transporter.sendMail(mailOptions, function(error, info)
  	{
  		if(error)
  		{
  			console.log(error);
  			res.redirect('/');
  		}
  		else
  		{
  			console.log('Message send: ' + info.response);
  			res.redirect('/');	
  		}
  	});
});


module.exports = router;
