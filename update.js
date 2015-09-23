
module.exports = function(url, handle, req, res) {
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
		console.log('body:', body);
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
		
		console.log('json: ', json);
		if (json != null) {
			handle.query('UPDATE user SET ? where id = ' + Number(path[path.length - 1]), json, function(error, result) {
				console.log(error, result)
				if (!error && result.affectedRows !== 0) {
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						id: Number(path[path.length - 1])
					}));
				} else {
					res.writeHead(204, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						status: 204,
						message: 'no content'
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