var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/'));

var port = process.env.PORT || 3000;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var server = require('http').Server(app);
server.listen(port);

