
module.exports = function(url, handle, req, res) {
	var path = url.split('/');
	console.log(path);
	
	handle.query('DELETE FROM user WHERE id = ' + Number(path[path.length - 1]), function(error, result) {
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
};