
var crypto = require('crypto');

var hash = function(string) {
	var shasum = crypto.createHash('sha1');
	shasum.update(string);
	return (shasum.digest('hex'));
}

var auth = function(req, res, handle, callback) {
	var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
	console.log("Authorization Header is: ", auth);

	if (!auth) {     // No Authorization header was passed in so it's the first time the browser hit us
		res.writeHead(401, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({
			staus: 401,
			message: 'unauthorized'
		}));
	} else if(auth) {    // The Authorization was passed in so now we validate it
		var tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

		var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
		var plain_auth = buf.toString();        // read it back out as a string

		console.log("Decoded Authorization ", plain_auth);

		var creds = plain_auth.split(':');      // split on a ':'
		var username = creds[0];
		var password = creds[1];

		handle.query('SELECT * FROM user WHERE email = ? and password = ?', [username, hash(password)], function(error, results, fields) {
			if (!error && results.length !== 0) {
				callback(results[0].role);
			} else {
				res.writeHead(401, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({
					staus: 401,
					message: 'unauthorized'
				}));
			}
		});
	}
}

var isPath = function(regex, path) {
	var r = new RegExp(regex, 'ig');
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
		
		auth(req, res, handle, function(role) {
			if (isPath('\/users\/[0-9]*', abs) && req.method == 'GET') {
				return (users(abs, handle, req, res));
			}
			
			if (isPath('\/search\/users.*', abs) && req.method == 'GET') {
				return (search(abs, handle, req, res));
			}
			
			if (isPath('\/users\/?', abs) && req.method == 'POST' && role == 'admin') {
				return (add(abs, handle, req, res));
			}
			
			if (isPath('\/users\/[0-9]+', abs) && req.method == 'PUT' && role == 'admin') {
				return (update(abs, handle, req, res));
			}
			
			if (isPath('\/users\/[0-9]+', abs) && req.method == 'DELETE' && role == 'admin') {
				return (remove(abs, handle, req, res));
			}
			
			if (abs == '/') {
				res.writeHead(200); // step1
				res.end('OK\n');
			} else {
				res.writeHead(404);
				res.end('KO\n');
			}
		});
	}).listen(80);
});
