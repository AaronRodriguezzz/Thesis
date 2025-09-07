import React from 'react'
import Skeleton from '@mui/material/Skeleton';
    
const TableLoading = () => {
    return (
        <div className="flex min-h-screen"> 
            <main className="p-4 w-full">
                <header className="w-full mb-6">
                    <Skeleton variant="text" width="25%" height={30} />
                    <Skeleton variant="text" width="30%" height={20} />
                </header>

                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Skeleton variant="rectangular" width="100%" height={30} />
                        </div>

                        <div className="w-full bg-white p-6 rounded-lg shadow">
                            <Skeleton variant="text" width="25%" height={30} />

                            <div className="overflow-x-auto h-[500px] w-full">
                                <Skeleton variant="rectangular" width="100%" height={500} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TableLoading