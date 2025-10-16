import React, { useState } from 'react'
import { FaChevronLeft,  FaChevronRight} from 'react-icons/fa';
import { useSectionViews } from '../../../hooks/HomeRef';
import { useFetch } from '../../../hooks/useFetch';
import { useIsMobile } from '../../../hooks/useIsInMobile';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';

const ProductSection = () => {
    const { data, loading, error } = useFetch('/get_data/product', null, null, [])
    const { sectionRefs, inViews } = useSectionViews();
    const navigate = useNavigate();
    const isMobile = useIsMobile(); 
    const itemsPerPage = isMobile ? 3 : 5; 
     
    const [productIndex, setProductIndex] = useState(0);
    
    const handlePrev = () => {
        setProductIndex((prev) => Math.max(prev - itemsPerPage, 0));
    };

    const handleNext = () => {
        setProductIndex((prev) =>
            Math.min(prev + itemsPerPage, data.length - itemsPerPage)
        );
    };

    const visibleProducts = data && data.slice(productIndex, productIndex + itemsPerPage);

    // if(loading || error) return

    return (
        <div id="Products" ref={sectionRefs.products} className="w-full flex flex-col items-center bg-gray-800 py-20 md:px-4">
            <motion.h1 
                initial={isMobile ? { opacity: 0, x: 0 } : { opacity: 0, x: -100 }}
                transition={{ duration: 1, ease: "easeInOut"}}
                animate={isMobile || inViews.products ? { opacity: 1, x: 0, y: 0 } : {}}
                className="text-white text-center font-extralight tracking-widest text-3xl md:text-5xl mb-10"
            > 
                PRODUCT CATALOG
            </motion.h1>
        
            <div className="relative w-full flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                className="absolute top-1/2 translate-y-1/2 left-0 md:static flex items-center justify-center md:p-2 hover:bg-gray-500 rounded-full"
            >
                <FaChevronLeft className="text-white" size={isMobile ? 20 : 40} />
            </button>

            {/* Product Cards Container */}
            <div className="w-full flex flex-wrap justify-center gap-6">
                {visibleProducts?.map((product, index) => (
                    <motion.div
                        key={product._id}
                        initial={isMobile ? { opacity: 0, x: 0 } : { opacity: 0, y: -20 }}
                        animate={isMobile || inViews.products ? { opacity: 1, x: 0, y: 0 } : {}}
                        transition={{ duration: 0.3, ease: "easeInOut", delay: index * 0.2 }}
                        className="bg-gray-700 h-[500px] w-[85%] sm:w-[45%] md:w-[30%] lg:w-[250px] p-4 hover:scale-105 transition-transform rounded-lg shadow-md"
                    >
                        <img
                        src={`${baseUrl}/${product.imagePath}`}
                        alt={product.name}
                        className="w-full h-[60%] md:h-[40%] lg:h-[60%] object-cover rounded-md mb-4 shadow"
                        />
                        <div className="text-white tracking-tight space-y-1">
                        <h2 className="text-md md:text-lg font-bold">{product.name}</h2>
                        <p className="text-base font-semibold">₱{product.price}</p>
                        <p className="text-md">{product.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                className="absolute top-1/2 translate-y-1/2 right-0 md:static flex items-center justify-center md:p-2 hover:bg-gray-500 rounded-full"
            >
                <FaChevronRight className="text-white" size={isMobile ? 20 : 40} />
            </button>
            </div>

            <motion.button
                initial={{ opacity: 0, y: 100}}
                animate={inViews.products ? { opacity: 1, y:0} : {}}
                transition={{ duration: 2, ease: "easeInOut" }}
                onClick={() => navigate('/available-products')}
                className="mt-10 bg-white text-gray-800 py-3 px-8 rounded-sm hover:bg-green-500 tracking-tight transition-colors"
            >
                BRANCH AVAILABILITY
            </motion.button>
        </div>
    )
}

export default ProductSection