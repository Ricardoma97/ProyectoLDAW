const mongoose= require('mongoose');

const VueloSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	destino: String,
	tipoDeVuelo: String,
	date:Date,
	capacidad:Number,
	piloto:{//Piloto
		id_referencia: ObjectId,
		photo:String,//o img
		Name:String,
		Birthday:Date,
		Direccion:String,
		mail:String,
		numeberOfFlights:Number
	}
});

module.exports = mongoose.model('vuelos', VueloSchema);