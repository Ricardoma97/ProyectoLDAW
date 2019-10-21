/*const mongoose= require('mongoose');
const user = new mongoose.Schema({
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

const AlluserSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	vuelos:[user]
});

module.exports = mongoose.model('allUsers', UserSchema);*/