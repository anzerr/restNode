
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200);
  res.end('OK\n');
}).listen(80);
