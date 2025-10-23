import React from "react";
import Skeleton from "@mui/material/Skeleton";

const AssignmentLoading = () => {
  return (
    <div className="flex min-h-screen bg-black/40">
      <main className="flex flex-col justify-center items-center p-4 w-full text-white">
        {/* Header section */}
        <div className="w-[90%] md:w-[95%] lg:w-[80%] flex justify-between items-center bg-gray-900/60 backdrop-blur-sm p-4 my-4 rounded-lg shadow-lg border border-gray-700">
          <div className="w-[70%]">
            <Skeleton
              variant="text"
              width="40%"
              height={30}
              sx={{ bgcolor: "grey.700" }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{ bgcolor: "grey.800" }}
            />
          </div>

          <Skeleton
            variant="text"
            width="30%"
            height={25}
            sx={{ bgcolor: "grey.700" }}
          />
        </div>

        {/* Subheader section */}
        <div className="w-[90%] md:w-[95%] lg:w-[80%] flex gap-x-3 items-center justify-between leading-3 mb-6">
          {[1, 2].map((_, i) => (
            <div
              key={i}
              className="w-[50%] flex items-center bg-gray-900/60 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-lg"
            >
              <Skeleton
                variant="circular"
                width={60}
                height={60}
                sx={{ bgcolor: "grey.700" }}
              />

              <div className="w-full pl-4">
                <Skeleton
                  variant="text"
                  width="50%"
                  height={25}
                  sx={{ bgcolor: "grey.700" }}
                />
                <Skeleton
                  variant="text"
                  width="70%"
                  height={18}
                  sx={{ bgcolor: "grey.800" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Cards Section */}
        <div className="w-full flex flex-row justify-center flex-wrap gap-6 mt-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative w-[80%] md:w-[25%] bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col items-center"
            >
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                sx={{ bgcolor: "grey.700" }}
              />
              <Skeleton
                variant="text"
                width="70%"
                height={28}
                sx={{ bgcolor: "grey.700", marginTop: 2 }}
              />
              <Skeleton
                variant="text"
                width="50%"
                height={20}
                sx={{ bgcolor: "grey.800" }}
              />

              <div className="w-full flex flex-col space-y-3 mt-6 px-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton
                    key={j}
                    variant="text"
                    width="100%"
                    height={30}
                    sx={{ bgcolor: "grey.800" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AssignmentLoading;
