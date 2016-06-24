var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to the database '+dburl);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected '+dburl);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error '+err);
});

// Only for windows DOES NOT WORK!!!!!
/*if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
  	console.log('Working?')
    process.emit("SIGINT");
  });

  rl.on("SIGTERM", function () {
    process.emit("SIGTERM");
  });

  rl.on("SIGUSR2", function () {
    process.emit("SIGTERM");
  });
}*/

// Following APIs only work on UNIX environments.
process.on("SIGINT", function () {
  //graceful shutdown
  mongoose.connection.close(function() {
  	console.log('Mongoose connection closed through app termination (SIGINT)');
  });
  process.exit(0);
});

process.on("SIGTERM", function () {
  //graceful shutdown
  mongoose.connection.close(function() {
  	console.log('Mongoose connection closed through app termination (SIGTERM)');
  });
  process.exit(0);
});

process.once("SIGUSR2", function () {
  //graceful shutdown
  mongoose.connection.close(function() {
  	console.log('Mongoose connection closed through app termination (SIGINT)');
  	process.kill(process.pid, 'SIGUSR2');
  });
});

// BRING IN SCHEMAS AND MODELS
require('./hotels.model.js');