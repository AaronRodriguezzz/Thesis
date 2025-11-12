import React, { useState } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaLock, FaUnlock  } from "react-icons/fa";
import { update_data } from "../../services/PutMethod";
import { useFetch } from "../../hooks/useFetch";
import { useDebounce } from "../../hooks/useDebounce";
import UpdateBranchModal from "../../components/modal/UpdateBranchModal";
import NewBranch from "../../components/modal/AddBranchModal";
import TableLoading from "../../components/animations/TableLoading";
import Pagination from "@mui/material/Pagination";

const Branches = () => {
    const [page, setPage] = useState(1);
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [addingBranch, setAddingBranch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);

    const { data, loading, error, setData } = useFetch(
        `/get_branches?search=${debouncedSearch}`,
        page,
        null,
        [page, debouncedSearch]
    );

    const paginationLimit = data?.pageCount || 1;

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm("Are you sure you want to open this branch?")) return;

        const newStatus = status === 'Open' ? 'Close' : 'Open';

        const res = await update_data(`/update_branch/${id}?status=${newStatus}`);

        if (res.updatedInfo) {
            setData((prev) => ({
                pageCount: prev.pageCount,
                branches: prev.branches.map(b => b._id === id ? res.updatedInfo : b)
            }))
        }
    };

    if (loading) return <TableLoading />;
    if (error)
        return (
            <p className="p-4 text-red-500 font-medium">
                Error loading data. Please try again later.
            </p>
        );

    return (
        <div>
            <main className="p-4 w-full">
                <div className="flex flex-col gap-6">
                    {/* 🔍 Search + Add Button */}
                    <div className="w-full bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow">
                        <div className="relative w-full sm:w-auto flex-grow">
                            <input
                                type="text"
                                placeholder="Search branches (Name, Address, Phone)..."
                                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-full text-sm text-white placeholder-white/60 tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                        </div>

                        <button
                            onClick={() => setAddingBranch(true)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 py-2 px-4 text-white rounded-full tracking-tighter text-sm transition ease-in-out"
                        >
                            <FaUserPlus /> Add Branch
                        </button>
                    </div>

                    {/* 📋 Table Section */}
                    <div className="w-full bg-black/40 border border-white/10 p-6 rounded-lg shadow text-white">
                        <div className="flex justify-between items-center my-4 text-sm">
                            <h2 className="text-xl font-semibold mb-4 tracking-tight">
                                Branch Table
                            </h2>
                            <Pagination
                                count={paginationLimit}
                                size="small"
                                page={page}
                                onChange={(event, value) => setPage(value)}
                            />
                        </div>

                        <div className="overflow-auto h-[570px] w-full">
                            <table className="min-w-full divide-y divide-black/20">
                                <thead className="bg-black/60 text-white">
                                    <tr className="text-left text-xs font-medium uppercase tracking-tight">
                                        <th className="px-4 py-3">Branch Name</th>
                                        <th className="px-4 py-3">Address</th>
                                        <th className="px-4 py-3">Phone</th>
                                        <th className="px-4 py-3">Number of Barbers</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-black/40 divide-y divide-black/20 text-sm text-white/90 tracking-tight">
                                    {data && data.branches?.length > 0 ? (
                                        data.branches.map((branch) => (
                                            <tr
                                                key={branch._id}
                                                className="hover:bg-white/10 transition-colors"
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {branch?.name}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {branch?.address}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {branch?.phone}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {branch?.numberOfBarber || 0} Barbers
                                                </td>
                                                <td 
                                                    className="px-4 py-4 whitespace-nowrap"
                                                    style={{ color: branch.status === 'Open' ? 'green' : 'red'}}
                                                >
                                                    {branch?.status}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex justify-center items-center gap-3">
                                                        <button
                                                            className="text-white/70 hover:text-white"
                                                            onClick={() => {
                                                                setOnUpdate(true);
                                                                setUpdatingData(branch);
                                                            }}
                                                        >
                                                            <FaEdit size={17} />
                                                        </button>
                                                        <button
                                                            className={`${
                                                                branch.status === "Open" ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"
                                                            } transition`}
                                                            onClick={() => handleStatusUpdate(branch._id, branch.status)}
                                                        >
                                                            {branch.status === "Open" ? (
                                                                <FaLock size={17} /> 
                                                            ) : (
                                                                <FaUnlock size={17} /> 
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-6 text-white/70"
                                            >
                                                No branches found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* 🧩 Modals */}
            {onUpdate && updatingData && (
                <UpdateBranchModal
                    currentData={updatingData}
                    onCancel={setOnUpdate}
                    setUpdatedData={setData}
                    route="/update_branch"
                />
            )}

            {addingBranch && (
                <NewBranch
                    setUpdatedData={setData}
                    onCancel={setAddingBranch}
                    route="/new_branch"
                />
            )}
        </div>
    );
};

export default Branches;
