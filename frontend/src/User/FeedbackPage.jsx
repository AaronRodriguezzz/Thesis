import React from 'react'
import { useEffect } from 'react'
import { get_data } from '../../services/GetMethod'
import Rating from '@mui/material/Rating'
import { useState } from 'react'
import { motion } from 'motion/react'

const FeedbackPage = () => {

    const [feedbacks, setFeedbacks] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    useEffect(() => {

        const getFeedbacks = async () => {
            const response = await get_data('/reviews', page);

            if(response){
                console.log(response.reviews);
                setFeedbacks(response.reviews);
                console.log(response.maxPage);
                setMaxPage(response.maxPage);
            }
        }

        getFeedbacks();
    },[page])

    return (
        <div className='h-screen w-screen p-4 py-10'>
            <div className='leading-7'>
                <h1 className='text-[30px] font-semibold'>All Feedbacks</h1>
                <p className='text-gray-700'>We value our customers feedback.</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
                {feedbacks.map((feeds, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -200 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .5, ease: "easeInOut", delay: index * .2 }}
                        className="w-full text-black sm:w-[300px] h-[300px] flex flex-col gap-y-4 justify-center items-center shadow-md p-4"
                    >
                        <Rating name="read-only" value={feeds.rating} readOnly />
                        <p className="w-[90%] tracking-tighter text-center break-all">
                            "{feeds.comment}"
                        </p>
                        <h2>-{feeds.customer.firstName}</h2>
                    </motion.div>
                ))}
            </div>

            <div className='w-full flex justify-between p-4'>
                <button 
                    className='px-4 py-2 bg-red-500 rounded-full text-white'
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    SEE LESS
                </button>
                <button
                    className='px-4 py-2 bg-green-500 rounded-full text-white'
                    onClick={() => setPage(page + 1)}
                    disabled={page === maxPage}
                >
                    SEE MORE
                </button>
            </div>
        </div>
    )
}

export default FeedbackPage