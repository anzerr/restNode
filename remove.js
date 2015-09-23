
module.exports = function(url, handle, req, re) {
	var path = url.split('/');
	console.log(path);
	
	handle.query('DELETE FROM posts WHERE title = ' + handle.escapeId(path[path.length - 1]), function(error, result) {
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
};