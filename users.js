
module.exports = function(url, handle, req, res) {
	var path = url.split('/');
	console.log(path);
	
	var query = 'SELECT * FROM `user`';
	if (path[path.length - 1] !== '') {
		query = 'SELECT * FROM user WHERE id = ' + Number(path[path.length - 1]);
	}
	
	console.log(query);
	handle.query(query, function(error, results, fields) {
		console.log(error, results);
		if (!error && results.length !== 0) {
			if (results.length !== 1) {
				for (var i in results) {
					if (results[i].role == 'admin') {
						results.splice(i, 1);
					}
				}
				
				if (results.length !== 0) {
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
				if (results[0].role !== 'admin') { // is not admin
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify(results[0]));
				} else {
					res.writeHead(401, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						status: 401,
						message: 'unauthorized'
					}));
				}
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