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
        user ? `/branch_appointments/${user?.branchAssigned}` : null, page
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

    const handle_updateStatus = async () => {
        if (!currentlyUpdatingId || !newStatus) return;

        const payload = {
            currentlyUpdatingId,
            newStatus,
        };

        try {
            const response = await update_data('/update_appointment', payload);

            if (response?.appointmentUpdate) {
                setData((prevList) =>
                    prevList.map((item) =>
                        item._id === currentlyUpdatingId ? { ...item, status: newStatus } : item
                    )
                );
                setCurrentlyUpdatingId(null); // close the edit mode
                setNewStatus(''); // reset the select
            }

        } catch (err) {
            console.error("Error updating appointment status:", err);
        }
    };


    if (loading) return <TableLoading />;
    if (error) return <p className="p-4 text-red-500">Error loading data</p>;

    return (
        <div className="flex">
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
                                onClick={() => setAddingAppointment(true)}
                            > 
                                <FaUserPlus /> 
                                Add Appointment 
                            </button>
                        </div>

                        <div className="w-full bg-white p-6 rounded-lg shadow">

                            <div className="flex justify-between items-center my-4 text-sm">
                                <h2 className="text-xl font-semibold mb-4 tracking-tight">Appointment Table</h2>

                                <Pagination
                                count={paginationLimit}
                                size="small"
                                page={page}
                                onChange={(event, value) => setPage(value)}
                                />
                            </div>

                            <div className="overflow-x-auto h-[500px] w-full">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Appointment Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Appointment Time</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Appointment Code</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Client Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Barber</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Service</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Additional Service</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredAppointments.map((appointment) => (
                                            <tr key={appointment._id}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment?.scheduledDate?.split('T')[0]}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{time.find(t => t.value === appointment?.scheduledTime)?.timeTxt || "—"}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment?.uniqueCode}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment?.customer?.lastName}, {appointment.customer?.firstName}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment.barber?.fullName?.trim() ? appointment.barber.fullName : "N/A"}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment?.service?.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment.additionalService?.name ? appointment?.additionalService?.name : "N/A"}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm tracking-tight">
                                                    {currentlyUpdatingId === appointment._id ? (
                                                            <select
                                                                value={newStatus}
                                                                onChange={(e) => setNewStatus(e.target.value)}
                                                                className="border px-2 py-1 rounded"
                                                            >
                                                                <option value="" disabled>Select Status</option>
                                                                <option value="booked">Booked</option>
                                                                <option value="cancelled">Cancelled</option>
                                                                <option value="no-show">No Show</option>
                                                            </select>
                                                        ) : (
                                                            <span
                                                                style={{
                                                                color:
                                                                    appointment.status === 'Booked'
                                                                    ? 'green'
                                                                    : appointment.status === 'Cancelled' || appointment.status === 'No-Show'
                                                                    ? 'red'
                                                                    : 'black',
                                                                }}
                                                            >
                                                                {appointment.status}
                                                            </span>
                                                        )
                                                    }
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex justify-center items-center gap-2">
                                                        {currentlyUpdatingId !== appointment._id ? (
                                                            <button
                                                                className="text-gray-600 hover:text-gray-800"
                                                                onClick={() => setCurrentlyUpdatingId(appointment?._id)}
                                                            >
                                                                <FaEdit size={17} />
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="text-green-600 hover:text-green-800"
                                                                    onClick={() => handle_updateStatus(appointment?._id, appointment?.status)} // you define this function
                                                                >
                                                                    <FaCheck size={17} />
                                                                </button>
                                                                <button
                                                                    className="text-red-600 hover:text-red-800"
                                                                    onClick={() => setCurrentlyUpdatingId(null)}
                                                                >
                                                                    <FaTimes size={17} />
                                                                </button>
                                                            </>
                                                        )}
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