import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { useFetch } from "../../hooks/useFetch";
import TableLoading from "../../components/animations/TableLoading";
import { useDebounce } from "../../hooks/useDebounce"; 
import { useAuth } from "../../contexts/UserContext";

const Appointments = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000); 
    const [page, setPage] = useState(1);
    const [dateFilter, setDateFilter] = useState("");

    let endpoint = `/all_appointments?page=${page}`;
    if (debouncedSearch) endpoint += `&search=${debouncedSearch}`;
    if (dateFilter) endpoint += `&date=${dateFilter}`;
    if (user?.branchAssigned) endpoint += `&branch=${user.branchAssigned}`

    const { data, loading, error } = useFetch(
        endpoint,
        page,
        null,
        [page, debouncedSearch, dateFilter]
    );

    const paginationLimit = data?.pageCount || 1;

    if (loading) return <TableLoading />;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div>
            <main className="p-4 w-full">
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        {/* Search & Filter */}
                        <div className="w-full bg-black/40 border border-black/20 p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search Appointment (Name, Date, Time)..."
                                    className="w-full pl-10 pr-4 py-2 bg-black/20 rounded-full text-sm tracking-tight text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/60"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                            </div>

                            <div className="flex items-center gap-x-2">
                                <input
                                    type="date"
                                    className="bg-black/20 border border-white/20 text-white text-sm rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/60"
                                    value={dateFilter}
                                    onChange={(e) =>
                                        setDateFilter(e.target.value)
                                    }
                                />
                                <button
                                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md transition ease-in-out"
                                    onClick={() => setDateFilter("")}
                                >
                                    CLEAR
                                </button>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="w-full bg-black/40 p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center my-4 text-sm">
                                <h2 className="text-xl font-semibold mb-4 tracking-tight text-white">
                                    Appointment Table
                                </h2>

                                <Pagination
                                    count={paginationLimit}
                                    size="small"
                                    page={page}
                                    onChange={(event, value) => setPage(value)}
                                    sx={{
                                        "& .MuiPaginationItem-root": {
                                            color: "white",
                                        },
                                        "& .Mui-selected": {
                                            color: "white !important",
                                            backgroundColor:
                                                "transparent !important",
                                            fontWeight: "bold",
                                            textDecoration: "underline",
                                        },
                                        "& .MuiPaginationItem-ellipsis": {
                                            color: "white",
                                        },
                                    }}
                                />
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto h-[570px] w-full">
                                <table className="min-w-full divide-y divide-black/20">
                                    <thead className="bg-black/60 text-white">
                                        <tr className="text-left text-xs font-medium uppercase tracking-tight">
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Service</th>
                                            <th className="px-4 py-3">
                                                Additional Service
                                            </th>
                                            <th className="px-4 py-3">Branch</th>
                                            <th className="px-4 py-3">Barber</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Time</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-black/40 divide-y divide-black/20 text-sm text-white/90 tracking-tight">
                                        {data && data.appointments?.map(
                                            (appointment) => (
                                                <tr key={appointment._id}>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {appointment.customer
                                                            ? `${appointment.customer.lastName}, ${appointment.customer.firstName}`
                                                            : "N/A"}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {appointment.service
                                                            ?.name || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                                        {appointment
                                                            .additionalService
                                                            ?.name || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {appointment.branch
                                                            ?.name || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {appointment.barber
                                                            ?.fullName?.trim()
                                                            ? appointment.barber
                                                                  .fullName
                                                            : "N/A"}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {appointment?.scheduledDate?.split(
                                                            "T"
                                                        )[0] || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {appointment?.scheduledTime ||
                                                            "N/A"}
                                                    </td>
                                                    <td
                                                        className="px-4 py-4 whitespace-nowrap"
                                                        style={{
                                                            color:
                                                                appointment.status ===
                                                                "booked"
                                                                    ? "lightgreen"
                                                                    : appointment.status ===
                                                                          "cancelled" ||
                                                                      appointment.status ===
                                                                          "no show"
                                                                    ? "red"
                                                                    : "white",
                                                        }}
                                                    >
                                                        {appointment?.status}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Appointments;
