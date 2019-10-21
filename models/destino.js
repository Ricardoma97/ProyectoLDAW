const mongoose= require('mongoose');

const DestinosSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	photo: String,//img
	distanceFromEarth: Number
	}
});

module.exports = mongoose.model('destinos', DestinosSchema);