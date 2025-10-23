import React from "react";
import Skeleton from "@mui/material/Skeleton";

const TableLoading = () => {
  return (
    <div className="flex min-h-screen bg-black/40 text-white">
      <main className="p-6 w-full">
        {/* Header */}
        <header className="w-full mb-6 bg-gray-900/60 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-lg">
          <Skeleton
            variant="text"
            width="25%"
            height={30}
            sx={{ bgcolor: "grey.700", mb: 1 }}
          />
          <Skeleton
            variant="text"
            width="30%"
            height={20}
            sx={{ bgcolor: "grey.800" }}
          />
        </header>

        {/* Content */}
        <div className="flex flex-col gap-6">
          <div className="space-y-6">
            {/* Search / Filter Row */}
            <div className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
              <Skeleton
                variant="rectangular"
                width="100%"
                height={30}
                sx={{ bgcolor: "grey.700", borderRadius: "6px" }}
              />
            </div>

            {/* Table Container */}
            <div className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700 p-6 rounded-lg shadow-lg">
              <Skeleton
                variant="text"
                width="25%"
                height={28}
                sx={{ bgcolor: "grey.700", mb: 2 }}
              />

              <div className="overflow-x-auto h-[500px] w-full rounded-lg">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={500}
                  sx={{ bgcolor: "grey.800", borderRadius: "10px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TableLoading;
