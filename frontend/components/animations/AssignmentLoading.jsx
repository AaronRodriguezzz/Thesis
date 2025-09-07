import React from 'react'
import Skeleton from "@mui/material/Skeleton";

const AssignmentLoading = () => {
    return (
        <div className="flex min-h-screen">
            <main className="flex flex-col justify-center items-center p-4 w-full">
                <div className="w-[90%] md:w-[95%] lg:w-[80%] flex justify-between items-center leading-3  text-white p-4 my-2 shadow rounded">
                    <div className="w-[70%] leading-0.5">
                        <Skeleton variant="text" width="30%" height={30} className="mb-4" />
                        <Skeleton variant="text" width="40%" height={20} />
                    </div>
                    
                    <Skeleton variant="text" width="30%" height={20} />
                </div>

                <div className="w-[90%] md:w-[95%] lg:w-[80%] flex gap-x-2 items-center justify-between leading-3 mb-4">
                    <div className="w-[50%] flex items-center bg-white gap-8 p-4">
                        <Skeleton variant="circular" width={60} height={50} />

                        <div className='w-full'>
                            <Skeleton variant="text" width="40%" height={30} className="mb-4" />
                            <Skeleton variant="text" width="60%" height={20} />
                        </div>
                    </div>

                    <div className="w-[50%] flex items-center bg-white gap-8 p-4">
                        <Skeleton variant="circular" width={60} height={50} />

                        <div className='w-full'>
                            <Skeleton variant="text" width="40%" height={30} className="mb-4" />
                            <Skeleton variant="text" width="60%" height={20} />
                        </div>
                    </div>
                </div>      

                <div className="w-full h-full flex flex-row justify-center gap-8 mt-10">
                    {Array.from({ length: 3}).map((_, i) => (
                        <div key={i} className="relative w-[25%] h-[80%] flex flex-col items-center bg-white shadow-lg rounded-lg p-4">
                            <Skeleton variant="circular" width={80} height={80} />
                            <Skeleton variant="text" width="80%" height={30} />
                            <Skeleton variant="text" width="50%" height={20} />


                            <div className="w-full flex flex-col space-y-3 mt-4 px-8">
                                <Skeleton variant="text" width="100%" height={30} />
                                <Skeleton variant="text" width="100%" height={30} />
                                <Skeleton variant="text" width="100%" height={30} />
                            </div>

                        </div>
                    ))}
                </div>
            </main>       
        </div>
    )
}

export default AssignmentLoading