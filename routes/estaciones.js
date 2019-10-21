var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const estacion = require('../models/estacion');
const jwt= require('jsonwebtoken');

// estacions listing get/
router.get('/', verifyToken,(req, res, next)=>{
	jwt.verify(
		req.token,
		'secretKey',
		(err,authData)=>{
			if(err) next(err);
			estacion.find({})
				.then(result =>{
					if(result.length){
						res.status(200).json({result});
					}else{
						res.status(404).json({message: 'There are no estations'});
					}
				})
				.catch(next)
		}
	)
});
//index estacion
router.get('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			estacion.findById(req.params.id).populate('bearer', '_id super_name')
				.then(result => {
					if(result)
						res.status(200).json({
							estacion: result
						});
					else
						res.status(404).send('estacion not found');
				})
				.catch(next)
		}
	)
})

/* POST /estacions */
router.post('/', (req, res)=>{
	let body = req.body;
	let newestacion = new estacion({
		_id: mongoose.Types.ObjectId(),
		...body
	})
	newestacion.save()
		.then(result => {
			res.status(201).send(result);
		})
		.catch(error =>{
			res.status(500).send("Couldn't register estacion");
		})
});

// PUT estacion
router.put('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			let body = req.body;
			estacion.findByIdAndUpdate(req.params.id, req.body, { new: true })
				.then(result => {
					if(result)
						res.status(201).json({
							estacion: result
						});
					else
						res.status(404).send('Cant update, estacion is missing');
				})
				.catch(next)
		}
	)
})

// DELETE estacion
router.delete('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			estacion.findByIdAndRemove(req.params.id)
				.then(() => res.status(204).send() )
				.catch(next)
		}
	)
});

// Authorization
function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization']
	let token = bearerHeader.split(' ');

	if(token && token[1]) {
		req.token = token[1];
		next();
	} else {
		next({
			message: 'Invalid token',
			name: 'Forbidden'
		})
	}
}

module.exports = router;