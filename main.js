
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200);
  res.end('Ok old\n');
}).listen(8080);
