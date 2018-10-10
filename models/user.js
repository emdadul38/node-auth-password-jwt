const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');
const Schema = mongoose.Schema;
const	SALT_WORK_FACTORY = 10;

// user schema
const userSchema = Schema({
	email: { type: String, trim: true, lowercase: true  },
	password: { type: String, required: true }
}, {
	timestamps: true
});

userSchema.pre('save', function(next){
	var user = this;

	// only hash the password if it has been modified (or is new)
	if(!user.isModified('password')) return next();

	// genereate a salt
	bcrypt.genSalt(SALT_WORK_FACTORY, function(err, salt){
		if(err)
			return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err)
				return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});


var User = module.exports  = mongoose.model('User', userSchema);

module.exports.getUserNameByEmail = function(email, cd) {

	User.findOne({email: email}, cd);
}

module.exports.getUserNameById = function(id, cd) {
	User.findById(id, cd);
}

module.exports.comparePassword = function(candidatePassword, hash, cb){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err)
			return cb(err);
		
		cb(null, isMatch);
	});
}
