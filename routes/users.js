var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt= require('jsonwebtoken');

/* GET users listing */
router.get('/', verifyToken,(req, res, next)=>{
	jwt.verify(
		req.token,
		'secretKey',
		(err,authData)=>{
			if(err) next(err);
			User.find({})
				.then(result =>{
					if(result.length){
						res.status(200).json({result});
					}else{
						res.status(404).json({message: 'Dersnopipol!'});
					}
				})
				.catch(next)
		}
	)
});

//index usuario
router.get('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			User.findById(req.params.id).populate('bearer', '_id super_name')
				.then(result => {
					if(result)
						res.status(200).json({
							user: result
						});
					else
						res.status(404).send('User not found');
				})
				.catch(next)
		}
	)
})
/* POST /users */
router.post('/', (req, res)=>{
	let body = req.body;
	let newUser = new User({
		_id: mongoose.Types.ObjectId(),
		...body
	})
	newUser.save()
		.then(result => {
			res.status(201).send(result);
		})
		.catch(error =>{
			res.status(500).send("Couldn't register user");
		})
});

router.post('/login', (req, res, next)=>{
	const body = req.body;
	if(!body.name || !body.password)return next({
		message: "name or password are missing",
		name: "Invalid"
	});
	User.findOne({name:body.name})
		.then(result=>{
			if(result){
				result.comparePass(body.password, function(err, isMatch){
					if(err) throw(err);
					if(isMatch){
						jwt.sign(
							{result},
							'secretKey',
							{ expiresIn: '1800s'},
							(err,accessToken)=>{
								if(err) next({
									mesagge: "Invalid operation",
									name:"Forbidden"
								});
							res.status(200).json({
							mesagge:"Succesfully logged in",
							accessToken: accessToken // TODO :acces token  req.send(accessToken)
						 })
							 // res.cookie("accessToken" , accessToken).send('');
							}
						);
						
					}else{
						res.status(401).json({
							mesagge:"name or password are incorrect inside else ismatch",
							name: "Forbidden"
						})
					}
				})
			}else{
				next({
					message: "name or password are incorrect",
					name: "Forbidden"

				})
			}
		})
});

//LOGIN
function verifyToken(req,res,next){
	const bearerHeader = req.headers['authorization'];
	let token = bearerHeader.split(' ');
	if(token && token[1]){
		//si llega token
		req.token=token[1];
		next();
	}else{
		next({
			message: "invalid Token",
			name:"Forbidden"
		})
	}
}

module.exports = router;