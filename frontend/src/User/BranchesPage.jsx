import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { motion } from "framer-motion";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:4001"
    : "https://tototumbs.onrender.com";

export default function BranchesPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetch("/get_data/branch");

  // Handle loading
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading branches...
        </p>
      </div>
    );

  // Handle error
  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-red-500 text-lg">
          Failed to load branches. Please try again later.
        </p>
      </div>
    );

  const branches = Array.isArray(data) ? data : [];

  return (
    <div id="Branches" className="min-h-screen p-2 pt-10 md:p-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center text-white mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <h1 className="text-4xl font-bold mb-2">Our Branches</h1>
          <p className="max-w-xl mx-auto">
            Find your nearest Toto Tumbs Barbershop branch and experience
            premium service at your convenience.
          </p>
        </motion.div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch, index) => (
            <motion.div
              key={branch?._id || index}
              className="bg-black/40 text-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={`${baseUrl}/${branch?.imagePath}`}
                alt={branch?.name || "Branch"}
                onError={(e) => (e.target.src = "/fallback-branch.jpg")}
                className="h-60 w-full object-cover bg-gray-300"
              />

              <div className="p-4">
                <h2 className="text-2xl font-semibold">{branch?.name}</h2>
                <p className="tracking-tight truncate">{branch?.address}</p>
                <p className="tracking-tight">{branch?.phone}</p>

                <button
                  className="mt-3 px-4 py-2 border text-white rounded-lg hover:bg-white hover:text-black transition text-sm"
                  onClick={() => navigate(`/appointment/${branch?._id}`)}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
