// Native mongodb driver
var dbconn = require('../data/dbconnection.js');
var ObjectId = require('mongodb').ObjectId;
var hotelData = require("../data/hotel-data.json");

module.exports.hotelsGetAll = function(req, res) {

	var db = dbconn.get();
	var hotelCollection = db.collection('hotels');

	var offset = 0;
	var count = 5;
	var maxCount = 10;

	if (req.query && req.query.offset) {
		offset = parseInt(req.query.offset, 10);
	}

	if (req.query && req.query.count) {
		count = parseInt(req.query.count, 10);
	}

	if (isNaN(offset) || isNaN(count)) {
		res
			.status(400)
			.json({
				"message": "If supplied in request offset and count should be numbers"
			});
		return;
	};

	if (count > maxCount) {
		res
			.status(400)
			.json({
				"message": "Count limit of " + maxCount + " exceeded"
			});
		return;
	};

	hotelCollection
		.find()
		.skip(offset)
		.limit(count)
		.toArray(function(err, docs) {
			console.log(docs);
			res.
			status(200)
				.json(docs);
		});

	// var returnData = hotelData.slice(offset, offset + count);
};

module.exports.hotelsGetOne = function(req, res) {

	var hotelId = req.params.hotelId;

	// Native driver
	hotelCollection
		.findOne({
			_id: ObjectId(hotelId)
		}, function(err, doc) {
			res
				.status(200)
				.json(doc);
		});
	//	var thisHotel = hotelData[hotelId];
};

module.exports.hotelsAddOne = function(req, res) {
	var db = dbconn.get();
	var hotelCollection = db.collection('hotels');
	var newHotel;

	console.log("Add new hotel is here");


	if (req.body && req.body.name && req.body.stars) {
		newHotel = req.body;
		newHotel.stars = parseInt(req.body.stars, 10);

		hotelCollection.insertOne(newHotel, function(err, response) {
			console.log(response);
			console.log(response.ops);
			res.
			status(201)
				.json(response.ops);
		});

	} else {
		res.
		status(400)
			.json({
				message: "Required data missing from body"
			});
	}

};