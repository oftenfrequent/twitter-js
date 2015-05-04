var express = require('express');
var router = express.Router();
var parser = require('body-parser');
// could use one line instead: var router = require('express').Router();
var tweetBank = require('../tweetBank');
var User = require('../models').User;
var Tweet = require('../models').Tweet;

var tweetCleaner = function(obj) {
	var retObj = {};
	retObj['tweetId'] = obj.id;
	retObj['tweet'] = obj.tweet;
	retObj['userId'] = obj.UserId;
	retObj['userName'] = obj.User.dataValues.name;
	retObj['pictureUrl'] = obj.User.dataValues.pictureUrl;
	return retObj;
}
var userTweetCleaner = function(obj) {
	var retObj = {};
	retObj['tweetId'] = obj.dataValues.id;
	retObj['tweet'] = obj.dataValues.tweet;
	return retObj;
}
var getUserInfo = function(obj) {
	// console.log(obj);
	var retUsr = {};
	retUsr['userId'] = obj.dataValues.id;
	retUsr['userName'] = obj.dataValues.name;
	retUsr['pictureUrl'] = obj.dataValues.pictureUrl;
	return retUsr;
}

module.exports = function (io) {
	router.use(parser.urlencoded({ extended: false }))
	router.use(parser.json());

	router.get('/', function (req, res) {
		Tweet.findAll({include: [ User ]}).then(function(tweets){
			res.render('index', {tweets: tweets.map(tweetCleaner)});
		})
	});

	router.get('/users/:id', function(req, res){
		User.find(
			{where: {id: req.params.id} },
			{include: [ Tweet ] })
		.then(function(user) {
			var arrOfTweets = user.Tweets;
			console.log(getUserInfo(user));
			res.render('userindex', { tweets: arrOfTweets.map(userTweetCleaner), showForm: true , user: getUserInfo(user)});
		});
	});

	router.get('/newuser', function(req, res) {
		res.render('newuser');
	});

	router.post('/newuser', function(req, res) {
		var name = req.body.name;
		var picUrl = req.body.pictureUrl;
		User.create({name: name, pictureUrl: picUrl}).then(function(user){
			res.redirect('/users/'+user.dataValues.id);
		})
	})

	router.get('/users/:name/tweets/:id', function(req, res){
		var name = req.params.name;
		var id = parseInt(req.params.id, 10);
		// var tweet = tweetBank.find({name: name});
		var tweetID = tweetBank.find({name: name, id: id});
		res.render('index', {title: 'Twitter.js - Posts by '+ name, list: tweetID })
	});

	router.post('/submit', function(req, res){
		Tweet.create({tweet: req.body.tweet, UserId: req.body.userId}).then(function(tweet){
			res.redirect('/users/'+req.body.userId);
		});
	});

	router.get('/deleteuser/:id',function(req,res){
		console.log("About to delete...")
		User.destroy({where: {id: req.params.id}}).then(function(rows){
			console.log("Deleted: ", rows);
		})
		.then(function(){
			Tweet.destroy({where: {UserId: req.params.id}}).then(function(deletedTweets){
				console.log("Deleted: ", deletedTweets);
				res.redirect('/');
			})
		})
	})

	return router;
}