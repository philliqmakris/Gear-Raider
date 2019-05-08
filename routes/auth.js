const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const db = require("../models/index");
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await db.User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username or password.');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid username or password.');

	const token = jwt.sign({ id: user.id }, process.env.jwtPrivateKey);
  res.json(token);
});

function validate(req) {
  return Joi.validate(req, {
    username: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
}

module.exports = router;