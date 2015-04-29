var express = require('express');
var router = express.Router();
var parser = require('body-parser');
// could use one line instead: var router = require('express').Router();
var tweetBank = require('../tweetBank');


module.exports = function (io) {
	router.use(parser.urlencoded({ extended: false }))
	router.use(parser.json());

	router.get('/', function (req, res) {
	  var blahblah = tweetBank.list();
	  res.render( 'index', { title: 'Twitter.js', list: blahblah, showForm: true } );
	});

	router.get('/users/:name', function(req, res){
		var name = req.params.name;
		var mmhmm = tweetBank.find({name: name});
		console.log(mmhmm);
		res.render('index', {title: 'Twitter.js - Posts by '+name, list: mmhmm, showForm: true, name:name })
	});

	router.get('/users/:name/tweets/:id', function(req, res){
		var name = req.params.name;
		var id = parseInt(req.params.id, 10);
		// var tweet = tweetBank.find({name: name});
		var tweetID = tweetBank.find({name: name, id: id});
		console.log(tweetID);
		// console.log(tweet);
		res.render('index', {title: 'Twitter.js - Posts by '+ name, list: tweetID })
	});

	router.post('/submit', function(req, res){
		// console.log(req.body);

		var name = req.body.name;
		var tweet = req.body.text;
		var theTweet = tweetBank.add(name, tweet);
		console.log(theTweet.text);
		io.sockets.emit('new_tweet', theTweet);
		res.redirect('/');
	});

	return router;
}