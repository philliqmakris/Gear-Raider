const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../models/index");
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  let user = await db.User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username or password.');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid username or password.');

  // token expires in 3 days
  const exp = Date.now() + 4320000;
	const token = jwt.sign({ id: user.id, exp, }, process.env.jwtPrivateKey);
  res.json(token);
});

module.exports = router;