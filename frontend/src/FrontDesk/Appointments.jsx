import React, { useEffect, useState, useMemo } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { time } from "../../data/TimeData";
import ThreeLayerModal from "../../components/modal/WalkinAppointment";
import { update_data } from "../../services/PutMethod";
import { useAdminPageProtection} from "../../hooks/userProtectionHooks";

const Appointments = () => {
    // useAdminPageProtection();
    const frontDesk = JSON.parse(localStorage.getItem('admin'));
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [appointmentList, setAppointmentList] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [addingAppointment, setAddingAppointment] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [currentlyUpdatingId, setCurrentlyUpdatingId] = useState('');

    const filteredAppointments = useMemo(() => {
        return appointmentList && appointmentList.filter(appointment =>
            appointment.customer?.lastName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.customer?.firstName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.service?.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.additionalService?.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.branch?.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.barber?.fullName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.scheduledDate?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.scheduledTime?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
                setAppointmentList((prevList) =>
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


    useEffect(() => {
        const get_employees = async () => {
            const data = await get_data(`/branch_appointments/${frontDesk?.branchAssigned}`, page);

            //exclude the barber's password
            if (data) {
                setAppointmentList(data.appointments);
                setPaginationLimit(data.pageCount);
            }
        };
        get_employees();
    }, [page]); 

    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">
                <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tighter text-gray-800">Appointment Management</h1>
                <p className="text-xs text-gray-500">Access your shop's appointments remotely.</p>
                </header>

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

                            <h2 className="text-xl font-semibold mb-4 tracking-tight">Appointment Table</h2>
                            <div className="flex justify-between items-center my-4 text-sm">
                                <div>
                                    <select 
                                        name="filter" 
                                        value={filterValue} 
                                        className="p-2 w-[200px] bg-gray-200 rounded-md outline-0 tracking-tight text-xs"
                                        onChange={(e) => setFilterValue(e.target.value)}
                                    >
                                        <option value="" disabled>Sort by</option>
                                        <option value="Date">Date</option>
                                        <option value="Status">Status</option>
                                        <option value="Service">Service</option>
                                        <option value="Branch">Branch</option>
                                    </select>
                                </div>

                                <Pagination
                                count={paginationLimit}
                                size="small"
                                page={page}
                                onChange={(event, value) => setPage(value)}
                                />
                            </div>

                            <div className="overflow-x-auto min-h-[400px] max-h-[600px] w-full">
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
                                                                    appointment.status === 'booked'
                                                                    ? 'green'
                                                                    : appointment.status === 'cancelled' || appointment.status === 'no show'
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
                    setNewData={setAppointmentList}
                />
            }
        </div>
    );
};

export default Appointments;