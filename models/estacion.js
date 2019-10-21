const mongoose= require('mongoose');

const EstacionSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
});

module.exports = mongoose.model('estaciones', EstacionSchema);