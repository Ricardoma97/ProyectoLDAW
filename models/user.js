const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	type: String,
	name: String,
	mail:{
		type: String,
		required: [true, "Can't be blank"],
		match:[/\S+@\S+.\S+/,'is invalid'],
		index:{unique:true}
	},
	password:{
		type: String,
		required: [true, "hey password!!"]
	},
	direccion: String
});

UserSchema.pre('save', function(next){
	let user = this;
	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, SALT_ROUNDS, (err, hash)=>{
		if (err) return next(err);
		user.password = hash;
		next();
	});
});
UserSchema.methods.comparePass = function(testPass, callback){
	let user = this;
	bcrypt.compare(testPass, user.password, function(err, isMatch){
		if(err) return callback(err);
		callback(null,isMatch);
	})
}

//

module.exports = mongoose.model('users', UserSchema);