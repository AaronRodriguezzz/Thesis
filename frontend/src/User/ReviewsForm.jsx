import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post_data } from '../../services/PostMethod';
import { motion } from 'framer-motion';
import { useUser } from '../../hooks/userProtectionHooks';
import { useCustomerPageProtection } from '../../hooks/userProtectionHooks';
import debounce from 'lodash.debounce';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

const ReviewForm = () => {
  useCustomerPageProtection();
  const navigate = useNavigate();
  const user = useUser();

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
    <div className="w-screen h-screen flex justify-center items-start">
      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5 }}
        className="bg-black/40 text-white bg-opacity-90 rounded-md shadow-md p-6 w-[280px] md:w-[400px] mx-auto" 
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold mb-4">Leave a Review</h1>

        <label className="block mb-2">Rating</label>
        <Box className="mb-4">
          <Rating
            name="rating"
            value={formData.rating}
            onChange={handleRatingChange}
            size="large"
            sx={{
              color: 'white',
              '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.3)' },
            }}
          />
        </Box>

        <label className="block mb-2">Comment</label>
        <textarea
          onChange={handleCommentChange}
          placeholder="Write your feedback here..."
          className="w-full px-3 py-2 rounded mb-1 resize-none shadow shadow-white"
          rows={4}
          maxLength={100}
        ></textarea>
        <div className={`text-right text-sm ${charCount > 100 ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount}/100
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 mt-4 text-black rounded-md text-lg ${
            loading ? 'bg-white/40 cursor-not-allowed' : 'bg-white'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </motion.form>           
    </div>
  );
};

export default ReviewForm;