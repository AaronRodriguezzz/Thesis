import React from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { motion } from "framer-motion";

const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';

export default function BranchesPage(){
    const navigate = useNavigate();
    const { data, loading, error } = useFetch('/get_data/branch', null, null, []);

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <p className="text-gray-600 text-lg animate-pulse">Loading branches...</p>
            </div>
        )

    if (error)
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <p className="text-red-500 text-lg">Failed to load feedbacks. Please try again later.</p>
            </div>
        )

    return (
        <div id='Branches' className="min-h-screen p-2 pt-10 md:p-12">
          {/* Header */}
          <motion.div 
            className="text-center text-white mb-10"
            initial={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            animate={{ opacity: 1 }}
          >
              <h1 className="text-4xl font-bold mb-2">Our Branches</h1>
              <p className="max-w-xl mx-auto">
                Find your nearest Toto Tumbs Barbershop branch and experience premium service at your convenience.
              </p>
          </motion.div>

          {/* Branch Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {data && data.map((branch,index) => (
              <motion.div 
                key={branch?._id} 
                className="bg-black/40 text-white rounded-2xl shadow-lg overflow-hidden transition hover:scale-[1.02]"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}  
                transition={{ duration: .5, ease: "easeInOut", delay: index * 0.3 }}
              >
                  <img    
                      src={`${baseUrl}/${branch?.imagePath}`}
                      alt={branch.name}
                      className="h-60 w-full object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-2xl font-semibold">{branch?.name}</h2>
                    <p className="tracking-tight truncate w-full">{branch?.address}</p>
                    <p className="tracking-tight">{branch?.phone}</p>
                      <button 
                        className="mt-3 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-800 text-sm"
                        onClick={() => navigate(`/appointment/${branch?._id}`)}
                      >
                          Book Now
                      </button>
                  </div>
              </motion.div>
            ))}
          </div>
        </div>
    );
};

