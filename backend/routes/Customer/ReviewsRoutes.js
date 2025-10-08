const express = require('express');
const router = express.Router();
const Reviews = require('../../controller/Customers/ReviewsControllers');
const verifyToken = require('../../middleware/Auth');

router.post('/api/submit_review', verifyToken, Reviews.createReview);
router.get('/api/reviews', Reviews.getReviews);
router.get('/api/top_reviews',  Reviews.getTopReviews);

module.exports = router;