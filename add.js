
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
			handle.query('SELECT * FROM user WHERE email = ?', [json.email || ''], function(error, results, fields) {
				if (results.length == 0) {
					handle.query('INSERT INTO user SET ?', json, function(error, result) {
						if (!error) {
							res.writeHead(201, {'Content-Type': 'application/json'});
							res.end(JSON.stringify({
								id: result.insertId
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
						message: 'email already exists'
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