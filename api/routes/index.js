var express = require('express');
var router = express.Router();

var ctrlHotels = require("../controllers/hotels.controllers");
var ctrlReviews = require("../controllers/reviews.controllers");


router
	.route("/hotels")
	.get(ctrlHotels.hotelsGetAll) // Get all hotels
	.post(ctrlHotels.hotelsAddOne); // Add a new hotel

// Get one hotel
router
	.route("/hotels/:hotelId")
	.get(ctrlHotels.hotelsGetOne)
	.put(ctrlHotels.hotelsUpdateOne)
	.delete(ctrlHotels.hotelsDeleteOne);

// Get all reviews for a hotel
router
	.route("/hotels/:hotelId/reviews")
	.get(ctrlReviews.reviewsGetAll)
	.post(ctrlReviews.reviewsAddOne);

// Get one review for a particular hotel
router
	.route("/hotels/:hotelId/reviews/:reviewId")
	.get(ctrlReviews.reviewsGetOne)
	.put(ctrlReviews.reviewsUpdateOne)
	.delete(ctrlReviews.reviewsDeleteOne);


module.exports = router;