import React from 'react'
import Rating from "@mui/material/Rating";
import { useNavigate } from 'react-router-dom';
import { useSectionViews } from '../../../hooks/HomeRef';
import { motion } from 'framer-motion';
import { useFetch } from '../../../hooks/useFetch';

const FeedbackSection = () => {
    const { sectionRefs, inViews } = useSectionViews();
    const { data, loading, error } = useFetch('/reviews', null, null, []);
    const navigate = useNavigate();

    return (
        <div className="px-4 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h1 className="my-6 font-extralight tracking-widest text-3xl md:text-4xl text-white">REVIEWS</h1>
                <button className="text-center underline hover:scale-110 transition text-white" onClick={() => navigate('/reviews')}>
                    VIEW MORE
                </button>
            </div>
        
            <div className="flex flex-wrap gap-4 justify-center" ref={sectionRefs.feedback}>
                {data && data.reviews.map((feeds, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -200 }}
                      animate={inViews.feedback ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: .5, ease: "easeInOut", delay: index * .2 }}
                      className="w-full sm:w-[300px] h-[300px] flex flex-col gap-y-4 justify-center items-center p-4 bg-black/30 text-white shadow shadow-white"
                    >
                      <Rating name="read-only" value={feeds.rating} readOnly />
                      <p className="tracking-tighter text-center">"{feeds.comment}"</p>
                      <h2>-{feeds.customer?.firstName}</h2>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default FeedbackSection