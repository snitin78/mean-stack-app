var fs = require('fs');

console.log("Going to get the file");

//Anonumous callback example
var file = fs.readFile("readFileASync.js", function(err, file) {
	//console.log(file);
	console.log("Got the file "+file.name);
});
console.log("Got the file");

//Name callback example
console.log("Going to get the file with named callback");

var fileCallback = function(err, file) {
	//console.log(file);
	console.log("Got the file with named callback ");
};

var file2 = fs.readFile("readFileASync.js", fileCallback);
console.log("Got the file");

console.log("Continuing the app...");