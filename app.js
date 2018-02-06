var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
var app = express();
var session = require('express-session');
var port = process.env.PORT || 3000;
app.use(session({ secret: 'this-is-a-secret-token',resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));
global.incidentTickets = {};
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());
app.use(routes);

var server = app.listen(port,function(){
	console.log("Application started listening port "+port);
	
});