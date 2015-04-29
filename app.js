var express = require( 'express' );
var app = express();
var logger = require('morgan');


app.listen(1337);

app.use(logger( 'dev' ));

app.get('/', function(req, res) {
	res.send('HOME');
});

app.get('/about', function(req, res) {
	res.send('ABOUT');
});

app.get('/jo', function(req, res) {
	res.send('Jo is awesome!')
});



