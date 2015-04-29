var express = require( 'express' );
var app = express();
var logger = require('morgan');
var fs = require('fs');
var tweet = require('./tweetBank');
var swig = require('swig');
var routes = require('./routes/');
swig.setDefaults({cache : false});

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.listen(1337);

app.use(logger( 'dev' ));
app.use('/', routes);

// app.get('/tweets', function(req, res) {
// 	// console.log(tweet.data);
// 	res.render('index', {title:"tweets", people: tweet.data});
// });

// app.put('/tweets', function(req, res){

// 	// tweet.add('name', 'text')
// 	// console.log(req.body);
// 	// console.log(req.body.text);
// 	res.render('layout')
// });

app.use(express.static(__dirname + '/public'));