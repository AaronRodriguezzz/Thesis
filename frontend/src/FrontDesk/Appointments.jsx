import React, { useEffect, useState, useMemo } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { time } from "../../data/TimeData";
import ThreeLayerModal from "../../components/modal/WalkinAppointment";
import { update_data } from "../../services/PutMethod";
import { useUser} from "../../hooks/userProtectionHooks";
import { useFetch } from "../../hooks/useFetch";
import TableLoading from "../../components/animations/TableLoading";

const Appointments = () => {
    const user = useUser();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [addingAppointment, setAddingAppointment] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [currentlyUpdatingId, setCurrentlyUpdatingId] = useState('');
    
    const { data, loading, error, setData } = useFetch(
        user ? `/branch_appointments/${user?.branchAssigned}` : null,
        page,
        null, 
        [page, user]
    );
    
    const appointmentList = data?.appointments || [];
    const paginationLimit = data?.pageCount || 1;

    const sortOrder = {
        'Booked': 1, 
        'Assigned': 2, 
        'Completed': 3, 
        'Cancelled': 4, 
        'No-Show': 5,
    }

    const filteredAppointments = useMemo(() => {
        if (!appointmentList) return [];

        return [...appointmentList] // <-- make a copy
            .sort((a, b) => sortOrder[a.status] - sortOrder[b.status])
            .filter((appointment) =>
            appointment.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.additionalService?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.branch?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.barber?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.scheduledDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.scheduledTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [appointmentList, searchTerm]);

    if (loading) return <TableLoading />;
    if (error) return <p className="p-4 text-red-500">Error loading data</p>;

    return (
        <div>
            <main className="px-2 w-full">
                <div>
                    <div className="space-y-4">
                        <div className="w-full bg-black/40 border border-black/20 p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input 
                                    type="text"
                                    placeholder="Search appointments (Name, Service, Date)..."
                                    className="w-full pl-10 pr-4 py-2 bg-black/20 rounded-full text-sm tracking-tight text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/60"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                            </div>
                            
                            <button 
                                className="flex items-center gap-2 bg-black/60 py-2 px-4 text-white rounded-full tracking-tighter text-sm border border-white/10 hover:bg-white hover:text-black transition"
                                onClick={() => setAddingAppointment(true)}
                            > 
                                <FaUserPlus /> 
                                Add Appointment 
                            </button>
                        </div>

                        <div className="w-full bg-black/40 p-6 rounded-lg">

                            <div className="flex justify-between items-center my-4 text-sm">
                                <h2 className="text-xl font-semibold mb-4 tracking-tight text-white">Appointment Table</h2>

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
                                        backgroundColor: "transparent !important",
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                        },
                                        "& .MuiPaginationItem-ellipsis": {
                                        color: "white",
                                        },
                                    }}
                                />
                            </div>

                            <div className="overflow-x-auto h-[570px] w-full">
                                <table className="min-w-full divide-y divide-black/20">
                                    <thead className="bg-black/60 text-white">
                                        <tr className="px-4 py-3 text-left text-xs font-medium uppercase tracking-tight">
                                            <th>Appointment Date</th>
                                            <th>Appointment Time</th>
                                            <th>Appointment Code</th>
                                            <th>Client Name</th>
                                            <th>Barber</th>
                                            <th>Service</th>
                                            <th>Additional Service</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-black/40 divide-y divide-black/20">
                                        {filteredAppointments.map((appointment) => (
                                            <tr className="px-4 py-4 whitespace-nowrap text-sm text-white/90 tracking-tight" key={appointment._id}>
                                                <td>{appointment?.scheduledDate?.split('T')[0]}</td>
                                                <td>{time.find(t => t.value === appointment?.scheduledTime)?.timeTxt || "—"}</td>
                                                <td>{appointment?.uniqueCode}</td>
                                                <td>{appointment?.customer?.lastName}, {appointment.customer?.firstName}</td>
                                                <td>{appointment.barber?.fullName?.trim() ? appointment.barber.fullName : "N/A"}</td>
                                                <td>{appointment?.service?.name}</td>
                                                <td>{appointment.additionalService?.name ? appointment?.additionalService?.name : "N/A"}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm tracking-tight">
                                                    <span
                                                        style={{
                                                            color:
                                                                appointment.status === 'Booked'
                                                                ? 'orange'
                                                                : appointment.status === 'Cancelled' || appointment.status === 'No-Show'
                                                                ? 'red'
                                                                : 'green',
                                                        }}
                                                    >
                                                        {appointment.status}
                                                    </span>
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

            {addingAppointment && 
                <ThreeLayerModal 
                    onClose={setAddingAppointment} 
                    setNewData={setData}
                />
            }
        </div>
    );
};

export default Appointments;