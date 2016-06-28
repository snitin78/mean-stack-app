var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res) {

	var hotelId = req.params.hotelId;

	Hotel
		.findById(hotelId)
		.select('reviews') // Reduces bandwidth
		.exec(function(err, hotel) {
			var response = {
				status: 200,
				message: []
			};

			if (err) {
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				response.status = 404;
				response.message = {
					"message": "No hotel found with provided id"
				};
			} else {
				response.status = 200;
				response.message = hotel.reviews ? hotel.reviews : [];
			}

			res
				.status(response.status)
				.json(response.message);
		});
};

module.exports.reviewsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("Get review " + reviewId + " for hotel " + hotelId);
	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel) {
			var response = {
				status: 200,
				message: {}
			};

			if (err) {
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				response.status = 404;
				response.message = {
					"message": "No hotel found with provided id"
				};
			} else if (!hotel.reviews) {
				response.status = 404;
				response.message = {
					"message": "No reviews found for the hotel"
				};
			} else {
				// Get the review
				response.message = hotel.reviews.id(reviewId);
				// If the review doesn't exist Mongoose returns null
				if (!response.message) {
					response.status = 404;
					response.message = {
						"message": "Review ID not found " + reviewId
					};
				}
			}

			res
				.status(response.status)
				.json(response.message);
		});
};

var _addReview = function(req, res, hotel) {

	hotel.reviews.push({
		name: req.body.name,
		rating: parseInt(req.body.rating, 10),
		review: req.body.review
	});

	hotel.save(function(err, hotelUpdated) {
		var response = {
			status: 201,
			message: hotelUpdated.reviews[hotelUpdated.reviews.length - 1]
		};

		if (err) {
			response.status = 500;
			response.message = err;
		}
		res
			.status(response.status)
			.json(response.message);
	});
};

module.exports.reviewsAddOne = function(req, res) {

	var hotelId = req.params.hotelId;

	Hotel
		.findById(hotelId)
		.select('reviews') // Reduces bandwidth
		.exec(function(err, hotel) {
			var response = {
				status: 200,
				message: []
			};

			if (err) {
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				response.status = 404;
				response.message = {
					"message": "No hotel found with provided id " + hotelId
				};
			}

			if (hotel) {
				_addReview(req, res, hotel);
			} else {
				res
					.status(response.status)
					.json(response.message);
			}
		});
};

module.exports.reviewsUpdateOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel) {
			var thisReview;
			var response = {
				status: 200,
				message: {}
			};
			if (err) {
				console.log("Error finding hotel");
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				console.log("Hotel id not found in database", id);
				response.status = 404;
				response.message = {
					"message": "Hotel ID not found " + id
				};
			} else {
				// Get the review
				thisReview = hotel.reviews.id(reviewId);
				// If the review doesn't exist Mongoose returns null
				if (!thisReview) {
					response.status = 404;
					response.message = {
						"message": "Review ID not found " + reviewId
					};
				}
			}
			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message);
			} else {
				thisReview.name = req.body.name;
				thisReview.rating = parseInt(req.body.rating, 10);
				thisReview.review = req.body.review;
				hotel.save(function(err, hotelUpdated) {
					if (err) {
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

module.exports.reviewsDeleteOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel) {
			var thisReview;
			var response = {
				status: 200,
				message: {}
			};
			if (err) {
				console.log("Error finding hotel");
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				console.log("Hotel id not found in database", id);
				response.status = 404;
				response.message = {
					"message": "Hotel ID not found " + id
				};
			} else {
				// Get the review
				thisReview = hotel.reviews.id(reviewId);
				// If the review doesn't exist Mongoose returns null
				if (!thisReview) {
					response.status = 404;
					response.message = {
						"message": "Review ID not found " + reviewId
					};
				}
			}
			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message);
			} else {
				hotel.reviews.id(reviewId).remove();
				hotel.save(function(err, hotelUpdated) {
					if (err) {
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