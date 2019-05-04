module.exports = function(err, req, res, next) {
	throw new Error(err);

	res.status(500).send('Something went wrong server-side.');
}