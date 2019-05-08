const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
// const Joi = require('joi');
const bcrypt = require('bcrypt');
const db = require("../models/index");
const express = require('express');
const router = express.Router();

// create a user and auto log in
router.post('/', async (req, res) => {
	// const { error } = validate(req.body); 
 //  if (error) return res.status(400).json(error.details[0].message);

  const username = req.body.username;

  let user = await db.User.findOne({
  	where: {
  		username,
  	},
  });
  if (user) return res.status(400).json('User already registered.');

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  
  const user = await db.User.create({
  	username,
  	password,
  });

  const token = jwt.sign({ id: user.id }, process.env.jwtPrivateKey);
  res.header('x-auth-token', token).json({ username: user.username, id: user.id });
});


// function validate() {
//     const schema = {
//       username: Joi.string().min(5).max(50).required(),
//       email: Joi.string().min(5).max(255).required().email(),
//       password: Joi.string().min(5).max(255).required()
//     };

//     return Joi.validate(this, schema);
//   }

module.exports = router; 
