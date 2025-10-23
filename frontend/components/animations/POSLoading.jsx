import React from "react";
import Skeleton from "@mui/material/Skeleton";

const POSLoading = () => {
  return (
    <div className="flex min-h-screen bg-black/40 text-white">
      <main className="p-6 w-full">
        {/* Header Section */}
        <header className="mb-6 bg-gray-900/60 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-lg">
          <Skeleton
            variant="text"
            width="30%"
            height={30}
            sx={{ bgcolor: "grey.700", mb: 1 }}
          />
          <Skeleton
            variant="text"
            width="40%"
            height={20}
            sx={{ bgcolor: "grey.800" }}
          />
        </header>

        {/* Content Area */}
        <div className="h-[80vh] flex flex-row gap-6">
          {/* Left Column */}
          <div className="flex-[3] flex flex-col space-y-6">
            {/* Search or Filter Bar */}
            <div className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-lg">
              <Skeleton
                variant="text"
                width="100%"
                height={30}
                sx={{ bgcolor: "grey.700" }}
              />
            </div>

            {/* Product Grid */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 p-6 rounded-lg shadow-lg">
              <Skeleton
                variant="text"
                width="30%"
                height={28}
                sx={{ bgcolor: "grey.700", mb: 2 }}
              />

              <div className="h-[560px] w-full flex flex-row flex-wrap justify-center gap-6 overflow-x-auto p-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col bg-gray-800/80 border border-gray-700 rounded-lg p-4 w-[200px] shadow-md"
                  >
                    <Skeleton
                      variant="rectangular"
                      width={180}
                      height={200}
                      sx={{ bgcolor: "grey.700", borderRadius: "8px" }}
                    />

                    <div className="w-full mt-3">
                      <Skeleton
                        variant="text"
                        width="100%"
                        height={18}
                        sx={{ bgcolor: "grey.700" }}
                      />
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={18}
                        sx={{ bgcolor: "grey.800" }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={18}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Checkout Panel) */}
          <div className="flex-1 bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-lg space-y-6">
            <Skeleton
              variant="text"
              width="60%"
              height={25}
              sx={{ bgcolor: "grey.700" }}
            />

            <Skeleton
              variant="rectangular"
              width="100%"
              height={550}
              sx={{ bgcolor: "grey.800", borderRadius: "8px" }}
            />

            <div className="flex flex-row justify-between items-center">
              <Skeleton
                variant="text"
                width="50%"
                height={20}
                sx={{ bgcolor: "grey.700" }}
              />
              <Skeleton
                variant="text"
                width="30%"
                height={20}
                sx={{ bgcolor: "grey.800" }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default POSLoading;
