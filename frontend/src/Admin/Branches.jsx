import React, { useEffect, useState, useMemo } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaClipboardList } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { delete_data } from "../../services/DeleteMethod";
import UpdateBranchModal from "../../components/modal/UpdateBranchModal";
import NewBranch from "../../components/modal/AddBranchModal";

const Branches = () => {
    const [branchList, setBranchList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [addingBranch, setAddingBranch] = useState(false);

    const filteredBranch = useMemo(() => {
        return branchList && branchList.filter(branch =>
            branch?.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch?.address.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch?.phone.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch?.numberOfBarber.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [branchList, searchTerm]);  


    const handle_delete = async (id) => {
        const data = await delete_data(id, '/delete_branch');

        if (data.deleted) {
            setBranchList(prev => prev.filter(branch => branch._id !== id));
        }
    }

    const handle_update = async (data) => {
        setOnUpdate(true);
        setUpdatingData(data);
    }


    useEffect(() => {
        const get_branches = async () => {
            const data = await get_data('/get_branches', page);
        
            //exclude the barber's password
            if (data) {
                setBranchList(data.branches);
                setPaginationLimit(data.pageCount);
            }
        };  
        get_branches();
    }, [page]);

    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">

                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input 
                                    type="text"
                                    placeholder="Search employees (Name, Role, Email)..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            <button 
                                className="flex items-center gap-2 bg-gray-700 py-2 px-4 text-white rounded-full tracking-tighter text-sm"
                                onClick={() => setAddingBranch(true)}
                            > 
                                <FaUserPlus /> 
                                Add Branch 
                            </button>
                        </div>


                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex flex-row justify-between mb-4">
                                <h2 className="text-2xl font-semibold mb-4 tracking-tight">Branch Table</h2>
                                <Pagination
                                    count={paginationLimit}
                                    size="small"
                                    page={page}
                                    onChange={(event, value) => setPage(value)}
                                />
                            </div>

                            <div className="min-h-[420px] w-full flex flex-row flex-wrap items-start justify-center gap-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Branch Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Address</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Phone</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Number of Barbers</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Action</th>
                                        </tr>
                                     </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredBranch.map((branch) => (
                                                <tr key={branch._id}>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{branch?.name}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{branch?.address} minutes</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight text-left">{branch?.phone}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight text-left">{branch?.numberOfBarber} </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <div className="flex justify-left items-center gap-2">
                                                            <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_update(branch)}>
                                                                <FaEdit size={17} />
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_delete(branch?._id)}>
                                                                <FaTrash size={17} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </main>

            {onUpdate && updatingData && 
                <UpdateBranchModal 
                    currentData={updatingData} 
                    onCancel={setOnUpdate} 
                    setUpdatedData={setBranchList}
                    route={'/update_branch'}
                />
            }

            {addingBranch && 
                <NewBranch 
                    setUpdatedData={setBranchList}
                    onCancel={setAddingBranch} 
                    route={'/new_branch'}
                />
            }
        </div>
    );
};

export default Branches;