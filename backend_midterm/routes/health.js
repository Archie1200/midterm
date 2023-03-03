var express = require('express');
var exp = express();
var opp = require('mongodb').ObjectId;

exp.get('/', function(req, res, next) {	
		res.sendStatus(200);
});

module.exports = exp;
