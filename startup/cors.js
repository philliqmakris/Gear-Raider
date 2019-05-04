
module.exports = function(app) {
  app.use(function(req, res, next) {
	  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	  res.header('Access-Control-Max-Age', '3600')
	  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token');
	  // allow cookies; remove if no cookies
	  // add withCredentials property on the XMLHttpRequest object, set both to true
	  // res.header('Access-Control-Allow-Credentials', 'true');
	  
	  next();
	});
}