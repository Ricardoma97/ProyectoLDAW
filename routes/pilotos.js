var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const piloto = require('../models/piloto');
const jwt= require('jsonwebtoken');

// pilotos listing get/
router.get('/', verifyToken,(req, res, next)=>{
	jwt.verify(
		req.token,
		'secretKey',
		(err,authData)=>{
			if(err) next(err);
			piloto.find({})
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
//index piloto
router.get('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			piloto.findById(req.params.id).populate('bearer', '_id super_name')
				.then(result => {
					if(result)
						res.status(200).json({
							piloto: result
						});
					else
						res.status(404).send('piloto not found');
				})
				.catch(next)
		}
	)
})

/* POST /pilotos */
router.post('/', (req, res)=>{
	let body = req.body;
	let newpiloto = new piloto({
		_id: mongoose.Types.ObjectId(),
		...body
	})
	newpiloto.save()
		.then(result => {
			res.status(201).send(result);
		})
		.catch(error =>{
			res.status(500).send("Couldn't register piloto");
		})
});

// PUT piloto
router.put('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			let body = req.body;
			piloto.findByIdAndUpdate(req.params.id, req.body, { new: true })
				.then(result => {
					if(result)
						res.status(201).json({
							piloto: result
						});
					else
						res.status(404).send('Cant update, piloto is missing');
				})
				.catch(next)
		}
	)
})

// DELETE piloto
router.delete('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			piloto.findByIdAndRemove(req.params.id)
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