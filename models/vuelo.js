const mongoose= require('mongoose');

const VueloSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	destino: String,
	tipoDeVuelo: String,
	arrivalDate:Date,
	launchDate: Date,
	capacidad:Number,
	piloto:{
		id_referencia: mongoose.Schema.Types.ObjectId,
		photo:String,
		Name:String,
		Birthday:Date,
		Direccion:String,
		mail:String,
		numeberOfFlights:Number
	}
});

module.exports = mongoose.model('vuelos', VueloSchema);