var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	if (isNaN(lng) || isNaN(lat)) {
		res
			.status(400)
			.json({
				"message": "When specified in the request lng and lat should be numbers"
			});
		return;
	}

	// A geoJSON point
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};

	var geoOptions = {
		spherical: true,
		maxDistance: 2000,
		num: 5
	};

	Hotel
		.geoNear(point, geoOptions, function(err, resultsArr, stats) {
			var response = {
				status: 200,
				message: resultsArr
			};

			if (err) {

			} else if (!resultsArr) {
				response.status = 404;
				response.message = {
					"message": "Not hotels found near the provided lng and lat"
				}
			}

			console.log('Geo results', resultsArr);
			console.log('Geo stats', stats);
			res
				.status(response.status)
				.json(response.message);
		});
};

module.exports.hotelsGetAll = function(req, res) {

	var offset = 0;
	var count = 5;
	var maxCount = 10;

	if (req.query && req.query.lat && req.query.lng) {
		runGeoQuery(req, res);
		return;
	}

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

	Hotel
		.find()
		.skip(offset)
		.limit(count)
		.sort({
			'name': 1
		})
		.exec(function(err, hotels) {
			var response = {
				status: 200, // Assume success
				message: hotels
			};

			if (err) {
				resonse.status = 500;
				response.message = err;
			}

			console.log("Found Hotels ", hotels.length);
			res
				.status(response.status)
				.json(response.message);
		});
};

module.exports.hotelsGetOne = function(req, res) {

	var hotelId = req.params.hotelId;

	Hotel
		.findById(hotelId)
		.exec(function(err, hotel) {
			var response = {
				status: 200, // Assume success
				message: hotel
			};

			if (err) {
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				response.status = 404;
				response.message = {
					"message": "Hotel with ID not found"
				};
			}
			res
				.status(response.status)
				.json(response.message);
		});
};

var _splitArray = function(input) {
	var output = [];
	if (input && input.length > 0) {
		output = input.split(';');
	}
	return output;
};

module.exports.hotelsAddOne = function(req, res) {

	Hotel
		.create({
			name: req.body.name,
			description: req.body.description,
			stars: parseInt(req.body.stars, 10),
			services: _splitArray(req.body.services),
			photos: _splitArray(req.body.photos),
			currency: req.body.currency,
			location: {
				address: req.body.address,
				coordinates: [
					parseFloat(req.body.lng),
					parseFloat(req.body.lat)
				]
			}

		}, function(err, newHotel) {
			var response = {
				status: 201,
				message: newHotel
			}

			if (err) {
				response.status = 400;
				response.message = err;
			} else {
				res
					.status(response.status)
					.json(response.message);
			}

		});
};

module.exports.hotelsUpdateOne = function(req, res) {
	var hotelId = req.params.hotelId;

	Hotel
		.findById(hotelId)
		.select("-reviews -rooms")
		.exec(function(err, hotel) {
			var response = {
				status: 200, // Assume success
				message: hotel
			};

			if (err) {
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				response.status = 404;
				response.message = {
					"message": "Hotel with ID not found"
				};
			}

			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message);
			} else {
				hotel.name = req.body.name;
				hotel.description = req.body.description,
				hotel.stars = parseInt(req.body.stars, 10),
				hotel.services = _splitArray(req.body.services),
				hotel.photos = _splitArray(req.body.photos),
				hotel.currency = req.body.currency,
				hotel.location = {
					address: req.body.address,
					coordinates: [
						parseFloat(req.body.lng),
						parseFloat(req.body.lat)
					]
				};

				hotel.save(function(err, hotelUpdated) {
					if(err) {
						res
						.status(500)
						.json(err);
					} else {
						res
						.status(204)
						.json();
					}
				});
			}
		});
};

module.exports.hotelsDeleteOne = function(req, res) {
	var hotelId = req.params.hotelId;

	Hotel
	.findByIdAndRemove(hotelId)
	.exec(function(err, hotel) {
		if(err) {
			res
			.status(404)
			.json(err);
		} else {
			console.log("Hotel deleted, id ", hotelId);

			res
			.status(204)
			.json();
		}

	});

};