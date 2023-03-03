var express = require('express')
var application = express()

application.get('/', function(req, res) {
	res.render('index', {title: 'CRUD File'})
})

module.exports = application;
