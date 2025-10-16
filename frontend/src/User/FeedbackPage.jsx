import React, { useState } from 'react'
import Rating from '@mui/material/Rating'
import { motion, AnimatePresence } from 'framer-motion'
import { useFetch } from '../../hooks/useFetch'

const FeedbackPage = () => {
    const [page, setPage] = useState(1)
    const { data, loading, error } = useFetch('/reviews', null, null, [page])

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <p className="text-gray-600 text-lg animate-pulse">Loading feedbacks...</p>
            </div>
        )

    if (error)
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <p className="text-red-500 text-lg">Failed to load feedbacks. Please try again later.</p>
            </div>
        )

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 py-10">
        {/* Header Section */}
        <div className="text-center leading-8 mb-10">
            <h1 className="text-[25px] md:text-3xl font-bold text-gray-800">Customer Feedbacks</h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-xl mx-auto">
            We truly appreciate your time and feedback. Here’s what our customers are saying about us.
            </p>
        </div>

        {/* Feedback Cards */}
        <div className="flex flex-wrap justify-center gap-6">
            <AnimatePresence>
            {data?.reviews?.length > 0 ? (
                data.reviews.map((feeds, index) => (
                <motion.div
                    key={feeds._id || index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, boxShadow: '0px 6px 15px rgba(0,0,0,0.1)' }}
                    className="bg-white rounded-2xl shadow-md w-full sm:w-[300px] h-[250px] md:h-[300px] flex flex-col justify-center items-center p-6"
                >
                    <Rating name="read-only" value={feeds.rating} readOnly size="medium" />
                    <p className="text-center italic text-gray-700 mt-3 px-2">“{feeds.comment}”</p>
                    <h2 className="mt-4 font-semibold text-gray-800">– {feeds.customer?.firstName}</h2>
                </motion.div>
                ))
            ) : (
                <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-lg text-center mt-10"
                >
                No feedbacks available at the moment.
                </motion.p>
            )}
            </AnimatePresence>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center items-center gap-6 mt-10">
            <button
            className="px-3 md:px-6 py-2 rounded-full bg-red-500 text-white text-sm md:text-md font-medium hover:bg-red-600 transition disabled:opacity-40"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            >
            Previous
            </button>

            <p className="text-gray-600 font-medium text-sm md:text-md">
            Page <span className="text-gray-800">{page}</span> of{' '}
            <span className="text-gray-800">{data?.maxPage || 1}</span>
            </p>

            <button
            className="px-3 md:px-6 py-2 rounded-full bg-green-500 text-white text-sm md:text-md font-medium hover:bg-green-600 transition disabled:opacity-40"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === data?.maxPage}
            >
            Next
            </button>
        </div>
        </div>
    )
}

export default FeedbackPage
