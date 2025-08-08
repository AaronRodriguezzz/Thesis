import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { get_data } from "../../services/GetMethod";
import { motion } from "framer-motion";
import { useUserProtection } from "../../hooks/useUser";

export default function BranchesPage(){
    useUserProtection();
    const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';
    const navigate = useNavigate();
    const [branches, setBranches] = useState(null);

    useEffect(() => {
      const get_branches = async () => {
          const branches = await get_data("/get_data/branch");

          if(branches){
            setBranches(branches);
          }
      }

      get_branches();
    },[])
    return (
        <div id='Branches' className="min-h-screen bg-gray-100 p-6">
          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            animate={{ opacity: 1, x: 0 }}
          >
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Branches</h1>
              <p className="text-gray-600 max-w-xl mx-auto">
              Find your nearest Toto Tumbs Barbershop branch and experience premium service at your convenience.
              </p>
          </motion.div>

          {/* Branch Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {branches && branches.map((branch,index) => (
              <motion.div 
                key={branch?._id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:scale-[1.02]"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}  
                transition={{ duration: .5, ease: "easeInOut", delay: index * 0.3 }}
              >
                  <img    
                      src={`${baseUrl}/${branch?.imagePath}`}
                      alt={branch?.name}
                      className="h-60 w-full obj  ect-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{branch?.name}</h2>
                    <p className="text-gray-600 tracking-tight">{branch?.address}</p>
                    <p className="text-gray-600 tracking-tight">{branch?.phone}</p>
                      <button 
                        className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
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

