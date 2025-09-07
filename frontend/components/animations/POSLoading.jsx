import React from 'react'
import Skeleton from "@mui/material/Skeleton";

const POSLoading = () => {
    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">
                <header className="mb-6">
                    <Skeleton variant="text" width="30%" height={30} className="mb-4" />
                    <Skeleton variant="text" width="40%" height={20} />
                </header>

                <div className="h-[80vh] flex flex-row gap-6">
                    <div className="flex-3 flex-col space-y-4">
                        <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Skeleton variant="text" width="100%" height={30} className="mb-4" />
                        </div>


                        <div className="bg-white p-6 rounded-lg shadow">
                            <Skeleton variant="text" width="30%" height={30} className="mb-4" />

                            <div className="h-[560px] w-full flex flex-row flex-wrap items-center justify-center gap-4 overflow-x-auto">
                                {Array.from({length: 4}).map((_, i) => (
                                    <div key={i} className="flex flex-col bg-gray-100 items-start p-4 w-[220px] shadow-md rounded-lg">
                                        {/* <img src={`${baseUrl}/${product.imagePath}`} alt="" className="w-[180px] h-[200px] rounded-lg mb-3 shadow-md"/> */}
                                        <Skeleton variant="rectangular" width={180} height={200} />

                                        <div className="w-full">
                                            <Skeleton variant="text" width="100%" height={20} />
                                            <Skeleton variant="text" width="50%" height={20} />
                                            <Skeleton variant="text" width="30%" height={20} />
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white space-y-5 rounded-md p-4">
                        <Skeleton variant="text" width="100%" height={20} />

                        <Skeleton variant="rectangular" width="100%" height={550} />
                        
                        <div className="flex flex-row justify-between items-center">
                            <Skeleton variant="text" width="100%" height={20} />
                        </div>
                    </div>  
                </div>
            </main>
        </div>
    )
}

export default POSLoading