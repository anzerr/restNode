

var path = './restNode/';
var url = 'https://github.com/anzerr/restNode.git';

fs.exists(path, function(exists) {
	if (exists)  {
		var git = spawn('git', ['clone', url]);
		
		git.stdout.on('data', function (data) {
			console.log(data);
		});
		git.stderr.on('data', function (data) {
			console.log(data);
		});
		
		git.on('exit', function(code, signal) {
			console.log(code, signal);
		});
	} else {
		var git = spawn('git', ['-C', path, 'pull']);
		
		git.stdout.on('data', function (data) {
			console.log(data);
		});
		git.stderr.on('data', function (data) {
			console.log(data);
		});
		
		git.on('exit', function(code, signal) {
			console.log(code, signal);
		});
	}
});