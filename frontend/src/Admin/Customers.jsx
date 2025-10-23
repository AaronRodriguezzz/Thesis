import React, { useEffect, useState, useMemo } from "react";
import { FaSearch, FaEdit, FaBan } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { update_data } from "../../services/PutMethod";
import CustomerUpdateModal from "../../components/modal/UpdateCustomerModal";
import TableLoading from "../../components/animations/TableLoading";

const Customers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [customersList, setCustomersList] = useState([]);
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filteredCustomers = useMemo(() => {
        return customersList.filter((customer) =>
            customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customersList, searchTerm]);

    const handle_disable = async (id) => {
        if (!window.confirm("Are you sure you want to disable this customer?")) return;

        try {
            const data = await update_data(`/disable_customer/${id}`);
            if (data.customer) {
                setCustomersList((prev) =>
                    prev.map((customer) => (customer._id === id ? data.customer : customer))
                );
            }
        } catch (error) {
            console.error("Error disabling customer:", error);
        }
    };

    const handle_update = (data) => {
        setOnUpdate(true);
        setUpdatingData(data);
    };

    useEffect(() => {
        const get_customers = async () => {
            try {
                const data = await get_data("/get_customers", page);
                if (data) {
                    setCustomersList(data.customers);
                    setPaginationLimit(data.pageCount);
                }
            } catch (err) {
                setError("Error fetching customers.");
            } finally {
                setLoading(false);
            }
        };

        get_customers();
    }, [page]);

    if (loading) return <TableLoading />;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="flex">
            <main className="p-4 w-full">
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
                                        {filteredCustomers.map((customer) => (
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
                                                            onClick={() => handle_update(customer)}
                                                        >
                                                            <FaEdit size={17} />
                                                        </button>
                                                        <button
                                                            className="text-red-400 hover:text-red-300"
                                                            onClick={() => handle_disable(customer._id)}
                                                        >
                                                            <FaBan size={17} />
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
                    setUpdatedData={setCustomersList}
                    route={"/update_customer"}
                />
            )}
        </div>
    );
};

export default Customers;
