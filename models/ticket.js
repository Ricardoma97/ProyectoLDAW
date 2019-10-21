const mongoose= require('mongoose');
const piloto= new mongoose.Schema({
	id_referencia: mongoose.Schema.Types.ObjectId,
	photo:String,//o img
	name:String,
	birthday:Date,
	direccion:String,
	mail:String,
	numeberOfFlights:Number
})
const vuelo = new mongoose.Schema({
	id: mongoose.Schema.Types.ObjectId,
	destino: String,
	tipoDeVuelo: String,
	arrivalDate:Date,
	launchDate:Date,
	capacidad:Number,
	piloto:piloto
});
const user = new mongoose.Schema({
	id:mongoose.Schema.Types.ObjectId,
	type: String,
	name: String,
	mail: String,
	direccion: String
});

const TicketSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	vuelo: vuelo,
	cost: Number,
	equipaje: String,
	cliente: user
});

module.exports = mongoose.model('tickets', TicketSchema);