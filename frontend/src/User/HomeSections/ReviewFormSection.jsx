import React, { useState } from 'react'
import { post_data } from '../../../services/PostMethod';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../hooks/userProtectionHooks';
import { useSectionViews } from '../../../hooks/HomeRef';
import { motion } from 'framer-motion';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

const ReviewFormSection = () => {
    const { sectionRefs, inViews } = useSectionViews();
    const navigate = useNavigate();
    const user = useUser();

    const [formData, setFormData] = useState({
        customer: user?._id || null,
        rating: 0,
        comment: ''
    });

    const [loading, setLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const handleRatingChange = (event, newValue) => {
        setFormData((prev) => ({ ...prev, rating: newValue }));
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
        <motion.div   
            ref={sectionRefs.feedback}
            initial={{ opacity: 0, x: -200 }}
            animate={inViews.feedback ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .7, ease: "easeInOut" }}
            className={`w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-center gap-8 py-20 z-20`}
        >
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-6 md:p-10 text-white">
                <h1 className="text-3xl md:text-5xl font-semibold">Give us your feedback!</h1>
                <p className="text-md md:text-lg">We value your feedback and would love to hear how we can improve your experience. Your suggestions help us grow and serve you better.</p>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2 text-white rounded-md shadow-md p-6"
                onSubmit={handleSubmit}
            >

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
                    onChange={(e) => {
                        setFormData((prev) => ({ ...prev, comment: e.target.value }));
                        setCharCount(e.target.value.length);
                    }}
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
                    disabled={loading || user === null}
                    className={`w-full py-2 mt-4 text-black rounded-md text-lg ${
                        loading || user === null ? 'bg-white/40 cursor-not-allowed' : 'bg-white'
                    }`}
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </motion.form>
        </motion.div>
    )
}

export default ReviewFormSection