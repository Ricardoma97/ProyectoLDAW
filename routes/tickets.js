var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ticket = require('../models/ticket');
const jwt= require('jsonwebtoken');

// tickets listing get/
router.get('/', verifyToken,(req, res, next)=>{
	jwt.verify(
		req.token,
		'secretKey',
		(err,authData)=>{
			if(err) next(err);
			ticket.find({})
				.then(result =>{
					if(result.length){
						res.status(200).json({result});
					}else{
						res.status(404).json({message: 'There are no tickets'});
					}
				})
				.catch(next)
		}
	)
});
//index ticket
router.get('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			ticket.findById(req.params.id).populate('bearer', '_id super_name')
				.then(result => {
					if(result)
						res.status(200).json({
							ticket: result
						});
					else
						res.status(404).send('ticket not found');
				})
				.catch(next)
		}
	)
})

/* POST /tickets */
router.post('/', (req, res)=>{
	let body = req.body;
	let newticket = new ticket({
		_id: mongoose.Types.ObjectId(),
		...body
	})
	newticket.save()
		.then(result => {
			res.status(201).send(result);
		})
		.catch(error =>{
			res.status(500).send("Couldn't register ticket");
		})
});

// PUT ticket
router.put('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			let body = req.body;
			ticket.findByIdAndUpdate(req.params.id, req.body, { new: true })
				.then(result => {
					if(result)
						res.status(201).json({
							ticket: result
						});
					else
						res.status(404).send('Cant update, ticket is missing');
				})
				.catch(next)
		}
	)
})

// DELETE ticket
router.delete('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);
			ticket.findByIdAndRemove(req.params.id)
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