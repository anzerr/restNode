
var isPath = function(regex, path) {
	var r = new RegExp(regex);
	return (r.test(path));
}

var users = require('./users.js');
var search = require('./search.js');
var add = require('./add.js');
var update = require('./update.js');
var remove = require('./remove.js');

var http = require('http'), mysql = require('mysql'), url = require('url');
var handle = mysql.createConnection({
	host     : '127.0.0.1',
	user     : 'root',
	password : '',
	database : 'tcm_rest'
});

handle.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log('connected as id ' + handle.threadId);
	  
	http.createServer(function (req, res) {
		var abs = url.parse(req.url).pathname;
		console.log(abs, req.method);
		
		if (isPath('\/users\/[0-9]+', abs) && req.method == 'GET') {
			return (users(abs, handle, req, res));
		}
		
		if (isPath('\/search\/users.*', abs) && req.method == 'GET') {
			return (search(abs, handle, req, res));
		}
		
		if (isPath('\/users\/?', abs) && req.method == 'POST') {
			return (add(abs, handle, req, res));
		}
		
		if (isPath('\/users\/[0-9]+', abs) && req.method == 'PUT') {
			return (update(abs, handle, req, res));
		}
		
		if (isPath('\/users\/[0-9]+', abs) && req.method == 'DELETE') {
			return (remove(abs, handle, req, res));
		}
		
		if (abs == '/') {
			res.writeHead(200); // step1
			res.end('OK\n');
		} else {
			res.writeHead(404);
			res.end('KO\n');
		}
	}).listen(80);
});
