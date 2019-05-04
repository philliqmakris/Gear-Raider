const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { User } = require("../models");
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	// User.create()
  console.log('users post');
});

module.exports = router; 
