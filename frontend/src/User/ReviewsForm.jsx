import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post_data } from '../../services/PostMethod';
import debounce from 'lodash.debounce';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

const ReviewForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    customer: user?._id,
    rating: 0,
    comment: ''
  });

  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, rating: newValue }));
  };

  const debouncedCommentChange = debounce((value) => {
    setCharCount(value.length);
    setFormData((prev) => ({ ...prev, comment: value }));
  }, 300);

  const handleCommentChange = (e) => {
    debouncedCommentChange(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await post_data(formData, '/submit_review');
    setLoading(false);

    if (response) {
      navigate('/');
    }
  };

  return (
    <div className="w-screen h-screen bg-[url('/login.png')] bg-cover bg-center pt-10 flex justify-center items-start">
      <motion.form 
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-white bg-opacity-90 rounded-md shadow-md p-6 w-[400px]" 
        onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold mb-4">Leave a Review</h1>

        <label className="block mb-2">Rating</label>
        <Box className="mb-4">
          <Rating
            name="rating"
            value={formData.rating}
            onChange={handleRatingChange}
            size="large"
          />
        </Box>

        <label className="block mb-2">Comment</label>
        <textarea
          onChange={handleCommentChange}
          placeholder="Write your feedback here..."
          className="w-full px-3 py-2 rounded mb-1 resize-none bg-gray-100 outline-gray-200"
          rows={4}
          maxLength={100}
        ></textarea>
        <div className={`text-right text-sm ${charCount > 100 ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount}/100
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 mt-4 text-white rounded-md text-lg ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </motion.form>           
    </div>
  );
};

export default ReviewForm;