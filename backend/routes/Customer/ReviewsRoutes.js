const express = require('express');
const router = express.Router();
const Reviews = require('../../controller/Customers/ReviewsControllers');

router.post('/api/submit_review', Reviews.createReview);
router.get('/api/all_reviews', Reviews.getReviews);
router.get('/api/top_reviews', Reviews.getTopReviews);

module.exports = router;