import React, { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { delete_data } from "../../services/DeleteMethod";
import NotificationBell from "../../components/NotificationBell";
import NotificationBar from "../../components/NotificationBar";

const Appointments = () => {
 
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [appointmentList, setAppointmentList] = useState([]);
    const [notifCount, setNotifCount] = useState(5);
    const [notifOpen, setNotifOpen] = useState(false);
    const [filterValue, setFilterValue] = useState('');

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


    useEffect(() => {
        const get_employees = async () => {
            const data = await get_data('/all_appointments', page);

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

            <NotificationBell
                isOpen={notifOpen}
                onClick={() => setNotifOpen(!notifOpen)}
            />

            <NotificationBar 
                isOpen={notifOpen}
                setNewCount={setNotifCount}
                appointments={appointmentList}
            />
            
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
                            placeholder="Search Appointment (Name, Date, Time)..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
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
                                onChange={(value) => setPage(value)}
                            />
                        </div>

                            <div className="overflow-x-auto min-h-[400px] max-h-[600px] w-full">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Service</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Additional Service</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Branch</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Barber</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Time</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredAppointments.map((appointment) => (
                                            <tr key={appointment._id}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment.customer?.lastName}, {appointment.customer?.firstName}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment.service?.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight text-center">{appointment.additionalService?.name ? appointment.barber?.fullName : "N/A"}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment.branch?.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment.barber?.fullName?.trim() ? appointment.barber.fullName : "N/A"}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment?.scheduledDate?.split('T')[0]}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{appointment?.scheduledTime}</td>
                                                <td 
                                                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight" 
                                                    style={appointment.status === 'booked' ? { color: 'green' } : appointment.status === 'cancelled' || 'no show' ? { color: 'red' } : '' }
                                                >
                                                    {appointment?.status}
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
        </div>
    );
};

export default Appointments;