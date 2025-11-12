import React, { useState } from "react";
import { FaSearch, FaEdit, FaBan, FaCheck } from "react-icons/fa";
import { update_data } from "../../services/PutMethod";
import { useFetch } from "../../hooks/useFetch";
import { useDebounce } from "../../hooks/useDebounce";
import CustomerUpdateModal from "../../components/modal/UpdateCustomerModal";
import TableLoading from "../../components/animations/TableLoading";
import Pagination from "@mui/material/Pagination";

const Customers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const debouncedSearch = useDebounce(searchTerm, 1000);
    
    const { data, loading, error, setData } = useFetch(
        `/get_customers?search=${debouncedSearch}`,
        page,
        null,
        [page, debouncedSearch]
    );

    console.log(data);
    // const customer = data.customers || []


    const paginationLimit = data?.pageCount || 1;

    const handle_disable = async (id, status) => {
        if (!window.confirm("Are you sure you want to disable this customer?")) return;

        const newStatus = status === 'Active' ? 'Inactive' : 'Active';

        try {
            const data = await update_data(`/disable_customer/${id}?status=${newStatus}`);
            if (data.customer) {
                setData((prev) => ({
                    ...prev, 
                    customers: prev.customers.map((item) =>
                        item._id === data.customer._id ? data.customer : item
                    ),
                }));
            }
        } catch (error) {
            console.error("Error disabling customer:", error);
        }
    };

    if (loading) return <TableLoading />;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="flex">
            <main className="px-2 w-full">
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="w-full bg-black/40 border border-black/20 p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search customers (Name, Email, Status)..."
                                    className="w-full pl-10 pr-4 py-2 bg-black/20 rounded-full text-sm tracking-tight text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/60"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="w-full bg-black/40 p-6 rounded-lg">
                            <div className="flex justify-between items-center my-4 text-sm">
                                <h2 className="text-xl font-semibold mb-4 tracking-tight text-white">
                                    Customer Table
                                </h2>

                                <Pagination
                                    count={paginationLimit}
                                    size="small"
                                    page={page}
                                    onChange={(event, value) => setPage(value)}
                                    sx={{
                                        "& .MuiPaginationItem-root": { color: "white" },
                                        "& .Mui-selected": {
                                            color: "white !important",
                                            backgroundColor: "transparent !important",
                                            fontWeight: "bold",
                                            textDecoration: "underline",
                                        },
                                        "& .MuiPaginationItem-ellipsis": { color: "white" },
                                    }}
                                />
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto h-[570px] w-full">
                                <table className="min-w-full divide-y divide-black/20">
                                    <thead className="bg-black/60 text-white">
                                        <tr className="text-left text-xs font-medium uppercase tracking-tight">
                                            <th className="px-4 py-3">Full Name</th>
                                            <th className="px-4 py-3">Phone</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-black/40 divide-y divide-black/20 text-sm text-white/90 tracking-tight">
                                        {data && data.customers.map((customer) => (
                                            <tr key={customer._id}>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {customer?.lastName}, {customer?.firstName}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {customer?.phone || "N/A"}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {customer?.email || "N/A"}
                                                </td>
                                                <td
                                                    className="px-4 py-4 whitespace-nowrap"
                                                    style={{
                                                        color:
                                                            customer.status === "Active"
                                                                ? "lightgreen"
                                                                : "red",
                                                    }}
                                                >
                                                    {customer?.status}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex justify-center items-center gap-3">
                                                        <button
                                                            className="text-white/70 hover:text-white"
                                                            onClick={() => {
                                                                setOnUpdate(true);
                                                                setUpdatingData(customer);
                                                            }}
                                                        >
                                                            <FaEdit size={17} />
                                                        </button>
                                                        <button
                                                            className={`${
                                                                customer.status === "Inactive"
                                                                ? "text-green-400 hover:text-green-300"
                                                                : "text-red-400 hover:text-red-300"
                                                            }`}
                                                            onClick={() => handle_disable(customer._id, customer.status)}
                                                        >
                                                            {customer.status === "Inactive" ? (
                                                                <FaCheck size={17} /> 
                                                            ) : (
                                                                <FaBan size={17} />
                                                            )}
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

            {onUpdate && updatingData && (
                <CustomerUpdateModal
                    currentData={updatingData}
                    onCancel={setOnUpdate}
                    setUpdatedData={setData}
                    route={"/update_customer"}
                />
            )}
        </div>
    );
};

export default Customers;
