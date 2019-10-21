var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const vuelo = require('../models/vuelo');
const jwt= require('jsonwebtoken');

// vuelos listing get/
router.get('/', verifyToken,(req, res, next)=>{
	jwt.verify(
		req.token,
		'secretKey',
		(err,authData)=>{
			if(err) next(err);
			vuelo.find({})
				.then(result =>{
					if(result.length){
						res.status(200).json({result});
					}else{
						res.status(404).json({message: 'There are no flights'});
					}
				})
				.catch(next)
		}
	)
});
//index vuelo
router.get('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			vuelo.findById(req.params.id).populate('bearer', '_id super_name')
				.then(result => {
					if(result)
						res.status(200).json({
							vuelo: result
						});
					else
						res.status(404).send('vuelo not found');
				})
				.catch(next)
		}
	)
})

/* POST /vuelos */
router.post('/', (req, res)=>{
	let body = req.body;
	let newvuelo = new vuelo({
		_id: mongoose.Types.ObjectId(),
		...body
	})
	newvuelo.save()
		.then(result => {
			res.status(201).send(result);
		})
		.catch(error =>{
			res.status(500).send("Couldn't register vuelo");
		})
});

// PUT vuelo
router.put('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			let body = req.body;
			vuelo.findByIdAndUpdate(req.params.id, req.body, { new: true })
				.then(result => {
					if(result)
						res.status(201).json({
							vuelo: result
						});
					else
						res.status(404).send('Cant update, vuelo is missing');
				})
				.catch(next)
		}
	)
})

// DELETE vuelo
router.delete('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			vuelo.findByIdAndRemove(req.params.id)
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