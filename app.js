//require('./api/data/dbconnection.js').open();
require('./api/data/dbmongoose.js');

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");

var routes = require("./api/routes");

app.set('port', 8080);

//'use' as middleware
app.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();
});

// Atuomatically send static files using express
app.use(express.static(path.join(__dirname, "public")));

// Use bodyParser here to parse form body for /apis. Putting it here will ignore static content calls.
app.use(bodyParser.urlencoded({
	extended: false // we only need strings and arrays from the form body
}));

// Using express routes
app.use("/api", routes);

var server = app.listen(app.get('port'), function() {
	console.log(server.address());
	var port = server.address().port;
	console.log("Magic happens on port " + port);
});