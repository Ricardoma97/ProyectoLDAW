const mongoose= require('mongoose');

const PilotoSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	photo:String,//o img
	name:String,
	birthday:Date,
	direccion:String,
	mail:String,
	numeberOfFlights:Number
	}
});

module.exports = mongoose.model('pilotos', PilotoSchema);