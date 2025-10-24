import React, { useEffect, useState, useMemo } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { delete_data } from "../../services/DeleteMethod";
import UpdateEmployee from "../../components/modal/UpdateEmployeeModal";
import NewEmployee from "../../components/modal/AddEmployeeModal";
import TableLoading from "../../components/animations/TableLoading";

const Employees = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [addingEmployee, setAddingEmployee] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filteredEmployees = useMemo(() => {
        if (!employeeList) return [];
        const term = searchTerm.toLowerCase().trim();
        if (!term) return employeeList;

        return employeeList.filter((e) =>
            [e?.email, e?.fullName, e?.branchAssigned?.name, e?.role].some(
                (field) =>
                    String(field || "").toLowerCase().includes(term)
            )
        );
    }, [employeeList, searchTerm]);

    const handle_delete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            const data = await delete_data(id, "/delete_employee");
            if (data.deleted) {
                setEmployeeList((prev) =>
                    prev.filter((employee) => employee._id !== id)
                );
            }
        } catch (err) {
            console.error("Error deleting employee:", err);
        }
    };

    const handle_update = (data) => {
        setOnUpdate(true);
        setUpdatingData(data);
    };

    useEffect(() => {
        const get_employees = async () => {
            try {
                const data = await get_data("/employees");
                if (data) {
                    setEmployeeList(data.employees);
                }
            } catch (err) {
                setError("Error fetching employees.");
            } finally {
                setLoading(false);
            }
        };
        get_employees();
    }, []);

    if (loading) return <TableLoading />;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div>
            <main className="p-4 w-full">
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        {/* Search Bar + Add Button */}
                        <div className="w-full bg-black/40 border border-black/20 p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search employees (Name, Role, Email)..."
                                    className="w-full pl-10 pr-4 py-2 bg-black/20 rounded-full text-sm tracking-tight text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/60"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                            </div>

                            <button
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 py-2 px-4 text-white rounded-full tracking-tighter text-sm transition ease-in-out"
                                onClick={() => setAddingEmployee(true)}
                            >
                                <FaUserPlus /> Add Employee
                            </button>
                        </div>

                        {/* Table Section */}
                        <div className="w-full bg-black/40 p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center my-4 text-sm">
                                <h2 className="text-xl font-semibold mb-4 tracking-tight text-white">
                                    Employees Table
                                </h2>
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
                                        {filteredEmployees.map((employee) => (
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
                                                                ? "lightgreen"
                                                                : "lightblue",
                                                    }}
                                                >
                                                    {employee?.role || "N/A"}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex justify-center items-center gap-3">
                                                        <button
                                                            className="text-white/70 hover:text-white"
                                                            onClick={() => handle_update(employee)}
                                                        >
                                                            <FaEdit size={17} />
                                                        </button>
                                                        <button
                                                            className="text-red-400 hover:text-red-300"
                                                            onClick={() =>
                                                                handle_delete(employee._id)
                                                            }
                                                        >
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

            {/* Modals */}
            {onUpdate && updatingData && (
                <UpdateEmployee
                    currentData={updatingData}
                    onCancel={setOnUpdate}
                    setUpdatedData={setEmployeeList}
                    route={"/update_employee"}
                />
            )}

            {addingEmployee && (
                <NewEmployee
                    setUpdatedData={setEmployeeList}
                    onCancel={setAddingEmployee}
                    route={"/new_employee"}
                />
            )}
        </div>
    );
};

export default Employees;
