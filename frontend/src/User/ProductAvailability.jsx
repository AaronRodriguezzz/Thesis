import {useEffect, useState} from "react";
import { FaChevronLeft,  FaChevronRight} from 'react-icons/fa';
import { get_data } from "../../services/GetMethod";
import { motion } from "framer-motion";

export default function ProductAvailability(){
    const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';
    
    const [products, setProducts] = useState(null);
    const [branches, setBranch] = useState(null);
    const [branchIndex, setBranchIndex] = useState(0);

    const handlePrev = () => {
        setBranchIndex((prev) => (prev - 1 + branches.length) % branches.length);
    };

    const handleNext = () => {
        setBranchIndex((prev) => (prev + 1) % branches.length);
    };

    useEffect(() => {
      const getProductByBranch = async () => {

          const [products, branches] = await Promise.all([
            await get_data("/get_data/product"),
            await get_data("/get_data/branch")
          ])

          console.log(products, branches);

          if(products) setProducts(products);
          if(branches) setBranch(branches)

      }
      getProductByBranch();
    },[])

    return (
        <div id='Branches' className="min-h-screen px-6">
            {/* Header */}
            <motion.div 
                className="text-center text-white mb-10"
                initial={{ opacity: 0, x: -50 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1 className="text-4xl font-bold mb-2">Branches Products Availability</h1>
                <p className="max-w-xl mx-auto">
                    Check your favorite product availability by branch. 
                </p>
            </motion.div>

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-y-8">
                    <div className="w-full rounded-full py-4 px-2 flex gap-x-8 justify-center  text-white bg-black/40 shadow shadow-white">
                        <button onClick={handlePrev}>
                            <FaChevronLeft size={30} />
                        </button>
                        <h1 className="text-2xl font-semibold tracking-tighter text-center">{branches && branches[branchIndex]?.name}</h1>
                        <button onClick={handleNext}>
                            <FaChevronRight size={30} />
                        </button>
                    </div>
                    <div className="w-full flex flex-wrap justify-center gap-6">
                        {products && products?.
                            map((product, index) => {
                           
                                const productExist = product.branch.find(
                                    (branchId) => branchId === branches[branchIndex]._id
                                );                 
                                
                                return productExist ? (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, x: 0, y: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut", delay: index * 0.1 }}
                                        className="h-[350px] lg:h-[400px] w-[80%] sm:w-[45%] md:w-[30%] lg:w-[250px] bg-black rounded-lg text-gray-200  p-2 hover:scale-105 transition-transform"
                                    >
                                        <img
                                            src={`${baseUrl}/${product.imagePath}`}
                                            alt={product.name}
                                            className="w-full h-[55%] object-cover rounded-md mb-4 shadow"
                                        />

                                        <div className="w-full tracking-tight space-y-1">
                                            <h2 className="text-sm lg:text-lg font-bold">{product.name}</h2>
                                            <p className="text-base font-semibold">₱{product.price}</p>
                                            <p className="text-sm">{product.description}</p>
                                        </div>

                                        <p className="mt-4 text-sm opacity-80">Stock: {product.branch.map((b, index) => b === branches[branchIndex]._id ? product.stock[index] : null)}</p>
                                    </motion.div>
                                ) : (
                                    null 
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

