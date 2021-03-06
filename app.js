const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose  = require('mongoose');

const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const pilotosRouter = require('./routes/pilotos');
const destinosRouter = require('./routes/destinos');
const estacionesRouter = require('./routes/estaciones');
const vuelosRouter = require('./routes/vuelos');
const ticketsRouter = require('./routes/tickets');

mongoose.connect('mongodb+srv://Ric:1234@andromcloster-57ngp.mongodb.net/test?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true}
);
const app = express();
// app.set('view engine', 'jade');
app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers','Content-Type,Token,Authorization');
	next();
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pilotos', pilotosRouter);
app.use('/destinos', destinosRouter);
app.use('/estaciones', estacionesRouter);
app.use('/vuelos', vuelosRouter);
app.use('/tickets', ticketsRouter);

app.get('*',(req, res) =>{
	res.status(404).send('Route not found');
})

module.exports = app;

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});