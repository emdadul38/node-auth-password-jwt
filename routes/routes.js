const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.json({ success: true, message: 'Welcome to the node app' });
	});

	app.post('/signup', function(req, res){
		var newUser = new User({
			email: req.body.email,
			password: req.body.password
		});
		
		newUser.save(function(err, user){
			if (err)
				throw err;

			res.json({ success: true, user: user });
		});
	});

	app.post('/login', function(req, res){
		const email = req.body.email;
		const password = req.body.password;

		User.getUserNameByEmail(email, function(err, user){
			if (err)
				throw err;

			if(!user) {
				res.json({ 'success': false, message: ' No User Found !! '});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(isMatch && !err) {
                	let token = jwt.sign(user.toJSON(), config.secret, {
                		expiresIn: 600000 
                	});

	                res.json({success : true, token: 'JWT '+token, user: {
	                		email: email,
	                		password: password
	                	}
                	});
                }else{
            		res.json({ 'success': false, message: ' Auth faild !! '});    	
                }
           	});			
		});
	});
	app.get('/profile', passport.authenticate('jwt', {session: false }), function(req, res){
		
		res.json({
			user: req.user.email
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}