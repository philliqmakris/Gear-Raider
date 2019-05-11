const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../models/index");
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  let user = await db.User.findOne({ where: { username: req.body.username }});
  if (!user) return res.status(400).send('Invalid username or .');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid  or password.');

  // token expires in 3 days
  const exp = Date.now() + 4320000;
	const token = jwt.sign({ id: user.id, exp, }, process.env.jwtPrivateKey);
  res.header('x-auth-token', token).json({ username: user.username });
});

module.exports = router;