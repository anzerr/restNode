
var http = require('http');
var server = http.createServer(function (req, res) {
  res.writeHead(200);
  res.end('Ok\n');
});
server.listen(80, '0.0.0.0');