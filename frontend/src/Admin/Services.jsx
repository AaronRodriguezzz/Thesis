import React, { useState } from "react";
import { FaSearch, FaEdit, FaCheck, FaUserPlus, FaBan } from "react-icons/fa";
import { update_data } from "../../services/PutMethod";
import { useFetch } from "../../hooks/useFetch";
import { useDebounce } from "../../hooks/useDebounce";
import TableLoading from "../../components/animations/TableLoading";
import NewService from "../../components/modal/AddServiceModal";
import UpdateService from "../../components/modal/UpdateServiceModal";
import Pagination from "@mui/material/Pagination";

const Services = () => {
    const [page, setPage] = useState(1);
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [addingService, setAddingService] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);

    const { data, loading, error, setData } = useFetch(
        `services?search=${debouncedSearch}`,
        page,
        null,
        [page, debouncedSearch]
    );

    const paginationLimit = data?.pageCount || 1

    const handleDisable = async (id, status) => {
        if (!window.confirm("Are you sure you want to disabled this service?")) return;
        
        const newStatus = status === 'Active' ? 'Disabled' : 'Active';

        const res = await update_data(`/disable_service/${id}?status=${newStatus}`);
        
        if(res.updatedInfo) {
            setData((prev) => ({
                pageCount: prev.pageCount,
                services: prev.services.map((item) =>
                    item._id === id ? res.updatedInfo : item
                )
            }));
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
                    {/* 🔍 Search and Add */}
                    <div className="w-full bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow">
                        <div className="relative w-full sm:w-auto flex-grow">
                            <input
                                type="text"
                                placeholder="Search services (Name, Type, Price)..."
                                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-full text-sm text-white placeholder-white/60 tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                        </div>

                        <button
                            onClick={() => setAddingService(true)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 py-2 px-4 text-white rounded-full tracking-tighter text-sm transition ease-in-out"
                        >
                            <FaUserPlus /> Add Service
                        </button>
                    </div>

                    {/* 📋 Services Table */}
                    <div className="w-full bg-black/40 border border-white/10 p-6 rounded-lg shadow text-white">
                        <div className="flex justify-between items-center my-4 text-sm">
                            <h2 className="text-xl font-semibold mb-4 tracking-tight">
                                Services Table
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
                                        <th className="px-4 py-3">Service Name</th>
                                        <th className="px-4 py-3">Duration</th>
                                        <th className="px-4 py-3">Price</th>
                                        <th className="px-4 py-3">Service Type</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-black/40 divide-y divide-black/20 text-sm text-white/90 tracking-tight">
                                    {data && data.services?.length > 0 ? (
                                        data.services.map((service) => (
                                            <tr
                                                key={service._id}
                                                className="hover:bg-white/10 transition-colors"
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {service?.name || "N/A"}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {service?.duration} mins
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    ₱ {service?.price}.00
                                                </td>
                                                <td
                                                    className="px-4 py-4 whitespace-nowrap"
                                                    style={{
                                                        color:
                                                            service?.serviceType ===
                                                            "Package Service"
                                                                ? "#22c55e"
                                                                : "#3b82f6",
                                                    }}
                                                >
                                                    {service?.serviceType}
                                                </td>
                                                <td 
                                                    className="px-4 py-4 whitespace-nowrap"
                                                    style={{ color: service.status === 'Active' ? 'green' : 'red'}}
                                                >
                                                    {service?.status}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex justify-center items-center gap-3">
                                                        <button
                                                            className="text-white/70 hover:text-white"
                                                            onClick={() => {
                                                                setOnUpdate(true);
                                                                setUpdatingData(service);
                                                            }}
                                                        >
                                                            <FaEdit size={17} />
                                                        </button>
                                                        <button
                                                            className={`${
                                                                service.status === "Disabled"
                                                                ? "text-green-400 hover:text-green-300"
                                                                : "text-red-400 hover:text-red-300"
                                                            }`}
                                                            onClick={() => handleDisable(service._id, service.status)}
                                                        >
                                                            {service.status === "Disabled" ? (
                                                                <FaCheck size={17} /> 
                                                            ) : (
                                                                <FaBan size={17} />
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
                                                No services found.
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
                <UpdateService
                    currentData={updatingData}
                    onCancel={setOnUpdate}
                    setUpdatedData={setData}
                    route="/update_service"
                />
            )}

            {addingService && (
                <NewService
                    setUpdatedData={setData}
                    onCancel={setAddingService}
                    route="/new_service"
                />
            )}
        </div>
    );
};

export default Services;
