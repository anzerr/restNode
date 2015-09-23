
module.exports = function(url, handle, req, res) {
	var path = url.split('/');
	console.log(path);
	
	handle.query('SELECT * FROM `user` WHERE id = ?', [path[path.length - 1]], function(error, results, fields) {
		console.log(error, results);
		if (!error && results.length !== 0) {
			if (results[0].role !== 'admin') { // is not admin
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(results[0]));
			} else {
				res.writeHead(401, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({
					staus: 401,
					message: 'unauthorized'
				}));
			}
		} else {
			res.writeHead(404, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				staus: 404,
				message: 'not found'
			}));
		}
	});
};