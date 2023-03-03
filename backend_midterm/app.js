var express = require('express');
var logger = require('morgan');
var application = express();
var expressMongo = require('express-mongo-db');

var config = require('./config');
application.use(expressMongo(config.database.url));

application.set('view engine', 'ejs');
application.use(express.static(__dirname + '/assets'));



application.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

var index = require('./routes/index');
var users = require('./routes/users');
var health = require('./routes/health');

var validate = require('express-validator');
application.use(validate());

var bodyParser = require('body-parser');

application.use(bodyParser.urlencoded({ extended: true }));
application.use(logger('dev'));
application.use(bodyParser.json());

var methodOverride = require('method-override');

var x = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

application.use(cookieParser('keyboard cat'));
application.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));
application.use(x());

application.use('/', index);
application.use('/users', users);
application.use('/health', health);

application.listen(3000, function(){
	console.log('Server running at port 3000: http://127.0.0.1:3000')
});
