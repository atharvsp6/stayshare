const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js");



//Reviews
//post review route

router.post("/",validateReview,isLoggedIn,isReviewAuthor,wrapAsync(reviewController.createReview));

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;


//delete all reviews
// async function deleteReviews(){
//     let res = await Review.deleteMany({});
//     console.log(res)
// }
// deleteReviews();
