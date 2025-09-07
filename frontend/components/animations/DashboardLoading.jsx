import React from "react";
import Skeleton from "@mui/material/Skeleton";

const DashboardLoading = () => {
  return (
    <div className="p-6 space-y-8">
      {/* 🔝 Top StatCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4"
          >
            <Skeleton variant="circular" width={50} height={50} />

            {/* Text placeholders */}
            <div className="flex-1">
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="60%" height={20} />
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <Skeleton variant="text" width="40%" height={30} className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <Skeleton variant="text" width="40%" height={30} className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </div>
      </div>

      {/* 👥 Customers Per Hour Chart */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <Skeleton variant="text" width="40%" height={30} className="mb-4" />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>

      {/* 📋 Sales Section */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <Skeleton variant="text" width="30%" height={30} className="mb-4" />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
    </div>
  );
};

export default DashboardLoading;
