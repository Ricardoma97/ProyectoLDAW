const mongoose= require('mongoose');
const piloto= new mongoose.Schema({
	id_referencia: mongoose.Schema.Types.ObjectId,
	photo:String,//o img
	Name:String,
	Birthday:Date,
	Direccion:String,
	mail:String,
	numeberOfFlights:Number
})
const vuelo = new mongoose.Schema({
	id: mongoose.Schema.Types.ObjectId,
	destino: String,
	tipoDeVuelo: String,
	date:Date,
	capacidad:Number,
	piloto:piloto
});
const user = new mongoose.Schema({
	id:ObjectId,
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
	}
});

module.exports = mongoose.model('tickets', TicketSchema);