
var url = require('url');
module.exports = function(abs, handle, req, res) {
	var query = (url.parse(req.url, true)).query;
	console.log(query);
	
	handle.query('SELECT * FROM `user` WHERE `email` like `%' + handle.escape(query.q) + '%`', function(error, results, fields) {
		for (var i in results) {
			delete results[i].password;
			if (results[i].role === 'admin') {
				results.splice(i, 1);
			}
		}
		
		console.log(error, results);
		if (!error && results.length !== 0) {
			if (true) { // is not admin
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(results));
			} else {
				res.writeHead(401, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({
					status: 401,
					message: 'unauthorized'
				}));
			}
		} else {
			res.writeHead(404, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				status: 404,
				message: 'not found'
			}));
		}
	});
};