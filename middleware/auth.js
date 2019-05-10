const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json('Access denied. Try logging in first.');

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    if (decoded.exp < Date.now()) throw new Error('token expired');
    
    req.user = decoded;
    next();
  }
  catch (ex) {
    res.status(400).json('Invalid token.');
  }
}