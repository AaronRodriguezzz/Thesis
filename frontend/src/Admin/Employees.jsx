import React, { useState } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { delete_data } from "../../services/DeleteMethod";
import { useFetch } from "../../hooks/useFetch";
import { useDebounce } from "../../hooks/useDebounce";
import TableLoading from "../../components/animations/TableLoading";
import UpdateEmployee from "../../components/modal/UpdateEmployeeModal";
import NewEmployee from "../../components/modal/AddEmployeeModal";

const Employees = () => {
    const [page, setPage] = useState(1);
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [addingEmployee, setAddingEmployee] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);

    // Use useFetch with search + pagination
    const { data, loading, error, setData } = useFetch(
        `/employees?search=${debouncedSearch}`,
        page,
        null,
        [page, debouncedSearch]
    );

    const paginationLimit = data?.pageCount || 1;

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        const res = await delete_data(id, "/delete_employee");
        if (res?.deleted) setData((prev) => prev.filter((e) => e._id !== id));
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
                    {/* 🔍 Search + Add */}
                    <div className="w-full bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow">
                        <div className="relative w-full sm:w-auto flex-grow">
                            <input
                                type="text"
                                placeholder="Search employees (Name, Role, Email)..."
                                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-full text-sm text-white placeholder-white/60 tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                        </div>

                        <button
                            onClick={() => setAddingEmployee(true)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 py-2 px-4 text-white rounded-full tracking-tighter text-sm transition ease-in-out"
                        >
                            <FaUserPlus /> Add Employee
                        </button>
                    </div>

                    {/* 📋 Employees Table */}
                    <div className="w-full bg-black/40 border border-white/10 p-6 rounded-lg shadow text-white">
                        <div className="flex justify-between items-center my-4 text-sm">
                            <h2 className="text-xl font-semibold mb-4 tracking-tight">
                                Employees Table
                            </h2>
                            <Pagination
                                count={paginationLimit}
                                size="small"
                                page={page}
                                onChange={(event, value) => setPage(value)}
                            />
                        </div>

                        <div className="overflow-auto h-[550px] w-full">
                            <table className="min-w-full divide-y divide-black/20">
                                <thead className="bg-black/60 text-white">
                                    <tr className="text-left text-xs font-medium uppercase tracking-tight">
                                        <th className="px-4 py-3">Full Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Branch Assigned</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-black/40 divide-y divide-black/20 text-sm text-white/90 tracking-tight">
                                    {data && data.employees?.length > 0 ? (
                                        data.employees.map((employee) => (
                                            <tr
                                                key={employee._id}
                                                className="hover:bg-white/10 transition-colors"
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {employee?.fullName || "N/A"}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {employee?.email || "N/A"}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {employee?.branchAssigned?.name || "N/A"}
                                                </td>
                                                <td
                                                    className="px-4 py-4 whitespace-nowrap"
                                                    style={{
                                                        color:
                                                            employee?.role === "Barber"
                                                                ? "#22c55e"
                                                                : "#3b82f6",
                                                    }}
                                                >
                                                    {employee?.role || "N/A"}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex justify-center items-center gap-3">
                                                        <button
                                                            className="text-white/70 hover:text-white"
                                                            onClick={() => {
                                                                setOnUpdate(true);
                                                                setUpdatingData(employee);
                                                            }}
                                                        >
                                                            <FaEdit size={17} />
                                                        </button>
                                                        <button
                                                            className="text-red-400 hover:text-red-300"
                                                            onClick={() =>
                                                                handleDelete(employee._id)
                                                            }
                                                        >
                                                            <FaTrash size={17} />
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
                                                No employees found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {onUpdate && updatingData && (
                <UpdateEmployee
                    currentData={updatingData}
                    onCancel={setOnUpdate}
                    setUpdatedData={setData}
                    route="/update_employee"
                />
            )}

            {addingEmployee && (
                <NewEmployee
                    setUpdatedData={setData}
                    onCancel={setAddingEmployee}
                    route="/new_employee"
                />
            )}
        </div>
    );
};

export default Employees;
