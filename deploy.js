
var fs = require('fs'), spawn = require('child_process').spawn, exec = require('child_process').exec, fork = require('child_process').fork;

var path = '/home/anzerr/restNode/';
var url = 'https://github.com/anzerr/restNode.git';

var format = function(line) {
    var out = [];
    var row = line.split(' ');
    for (var i in row) {
        if (row[i] !== '') {
            out.push(row[i]);
        }
    }
    return (out);
}

var restart = function(callback) {
    exec('ps aux', function(err, stdout, stderr) {
        var kill = [];
        var lines = stdout.toString().split('\n');
        for (var i in lines) {
            var row = format(lines[i]);
            if (row[row.length - 2] === 'node' && row[1] != process.pid) {
                kill.push(row[1]);
            }
        }

        for (var i in kill) {
            exec('kill -9 ' + kill[i], function() {
                console.log('killed');
            });
        }

        spawn('node', [path + 'main.js']);
    });
}

fs.exists(path, function(exists) {
        if (!exists)  {
                var git = spawn('git', ['clone', url]);

                git.stdout.on('data', function (data) {
                    console.log(data.toString('utf8'));
                });
                git.stderr.on('data', function (data) {
                    console.log(data.toString('utf8'));
                });

                git.on('exit', function(code, signal) {
                        console.log(code, signal);
                });
        } else {
            var git = spawn('git', ['--git-dir=' + path + '.git', '--work-tree=' + path, 'pull']);

                git.stdout.on('data', function (data) {
                    if ((data.toString('utf8')).trim() != 'Already up-to-date.') {
                        restart();
                    }
                });
                git.stderr.on('data', function (data) {
                    console.log(data.toString('utf8'));
                });

                git.on('exit', function(code, signal) {
                    console.log(code, signal);
                });
        }
});
