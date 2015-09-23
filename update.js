
module.exports = function(url, handle, req, re) {
	var body = '';
	req.on('data', function(data) {
		body += data;

		// Too much POST data, kill the connection!
		if (body.length > 1e6) {
			request.connection.destroy();
		}
	});
	
	var path = url.split('/');
	console.log(path);
	req.on('end', function() {
		var json = null;
		try {
			var a = JSON.parse(body), b = {};
			for (var i in a) {
				if (i != 'id') {
					b[i] = a[i];
				}
			}
			json = b;
		} catch (e) {
			console.log(e);
		}
		
		if (json != null) {
			handle.query('UPDATE user SET ? where id = ' + handle.escapeId(path[path.length - 1]), json, function(error, result) {
				if (!error && result.affectedRows !== 0) {
					res.writeHead(201, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						id: Number(path[path.length - 1])
					}));
				} else {
					res.writeHead(400, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						status: 400,
						message: 'bad request'
					}));
				}
			});
		} else {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				status: 400,
				message: 'bad request'
			}));
		}
	});
};