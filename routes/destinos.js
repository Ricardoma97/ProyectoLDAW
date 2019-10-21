var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const destino = require('../models/destino');
const jwt= require('jsonwebtoken');

// destinos listing get/
router.get('/', verifyToken,(req, res, next)=>{
	jwt.verify(
		req.token,
		'secretKey',
		(err,authData)=>{
			if(err) next(err);
			destino.find({})
				.then(result =>{
					if(result.length){
						res.status(200).json({result});
					}else{
						res.status(404).json({message: 'There are no pilots'});
					}
				})
				.catch(next)
		}
	)
});
//index destino
router.get('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			destino.findById(req.params.id).populate('bearer', '_id super_name')
				.then(result => {
					if(result)
						res.status(200).json({
							destino: result
						});
					else
						res.status(404).send('destino not found');
				})
				.catch(next)
		}
	)
})

/* POST /destinos */
router.post('/', (req, res)=>{
	let body = req.body;
	let newdestino = new destino({
		_id: mongoose.Types.ObjectId(),
		...body
	})
	newdestino.save()
		.then(result => {
			res.status(201).send(result);
		})
		.catch(error =>{
			res.status(500).send("Couldn't register destino");
		})
});

// PUT destino
router.put('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			let body = req.body;
			destino.findByIdAndUpdate(req.params.id, req.body, { new: true })
				.then(result => {
					if(result)
						res.status(201).json({
							destino: result
						});
					else
						res.status(404).send('Cant update, destino is missing');
				})
				.catch(next)
		}
	)
})

// DELETE destino
router.delete('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			destino.findByIdAndRemove(req.params.id)
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