const Reviews = require('../../models/Reviews'); // adjust path as needed

// POST /submit_review
const createReview = async (req, res) => {
  const { customer, rating, comment } = req.body;

  if (!customer || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }


  try {
    const review = new Reviews({
      customer,
      rating,
      comment
    });

    await review.save();
    return res.status(200).json({ message: 'Review submitted successfully.', review });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.', error: err });
  }
};

// GET /get_reviews?targetType=Barber&targetId=123
const getReviews = async (req, res) => {

  try {
    const reviews = await Reviews.find()
      .populate('customer', 'fullName') // Adjust fields as needed
      .sort({ createdAt: -1 });

    return res.status(200).json({ reviews });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error fetching reviews', error: err });
  }
};

const getTopReviews = async (req, res) => {

  try {
    const reviews = await Reviews.find({ rating: 5 })
      .populate('customer', 'fullName') // Adjust fields as needed
      .sort({ createdAt: -1 });

    return res.status(200).json({ reviews });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error fetching reviews', error: err });
  }
};

module.exports = {
  createReview,
  getReviews,
  getTopReviews
};
