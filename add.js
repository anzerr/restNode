
module.exports = function(url, handle, req, res) {
	var body = '';
	req.on('data', function(data) {
		body += data;

		// Too much POST data, kill the connection!
		if (body.length > 1e6) {
			request.connection.destroy();
		}
	});
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
			handle.query('INSERT INTO user SET ?', json, function(error, result) {
				if (!error) {
					res.writeHead(201, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						id: result.insertId
					}));
				} else {
					res.writeHead(400, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						staus: 400,
						message: 'bad request'
					}));
				}
			});
		} else {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				staus: 400,
				message: 'bad request'
			}));
		}
	});
};