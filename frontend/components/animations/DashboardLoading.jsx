import React from "react";
import Skeleton from "@mui/material/Skeleton";

const DashboardLoading = () => {
  return (
    <div className="min-h-screen p-6 space-y-8 bg-black/40 text-white">
      {/* 🔝 Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 shadow-lg rounded-2xl p-5 flex items-center gap-4"
          >
            <Skeleton
              variant="circular"
              width={50}
              height={50}
              sx={{ bgcolor: "grey.700" }}
            />
            <div className="flex-1">
              <Skeleton
                variant="text"
                width="80%"
                height={28}
                sx={{ bgcolor: "grey.700" }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                sx={{ bgcolor: "grey.800" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg p-6">
          <Skeleton
            variant="text"
            width="40%"
            height={30}
            sx={{ bgcolor: "grey.700", mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ bgcolor: "grey.800", borderRadius: "12px" }}
          />
        </div>

        {/* Line Chart */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg p-6">
          <Skeleton
            variant="text"
            width="40%"
            height={30}
            sx={{ bgcolor: "grey.700", mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ bgcolor: "grey.800", borderRadius: "12px" }}
          />
        </div>
      </div>

      {/* 👥 Customers Per Hour Chart */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg p-6">
        <Skeleton
          variant="text"
          width="40%"
          height={30}
          sx={{ bgcolor: "grey.700", mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ bgcolor: "grey.800", borderRadius: "12px" }}
        />
      </div>

      {/* 📋 Sales Section */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg p-6">
        <Skeleton
          variant="text"
          width="30%"
          height={30}
          sx={{ bgcolor: "grey.700", mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ bgcolor: "grey.800", borderRadius: "12px" }}
        />
      </div>
    </div>
  );
};

export default DashboardLoading;
