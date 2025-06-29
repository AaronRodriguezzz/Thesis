import React, { useEffect, useState, useMemo } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { delete_data } from "../../services/DeleteMethod";
import NewService from "../../components/modal/AddServiceModal";
import UpdateService from "../../components/modal/UpdateServiceModal";

const Services = () => {
 
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [addingService, setAddingService] = useState(false);

    const filteredEmployees = useMemo(() => {
        return services && services.filter(service =>
            service?.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            service?.duration.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            service?.price.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            service?.serviceType.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [services, searchTerm]);


    const handle_delete = async (id) => {
        console.log('delete id', id);
        const data = await delete_data(id, '/delete_service');

        if (data.deleted) {
            setServices(prev => prev.filter(service => service._id !== id));
        }
    }

    const handle_update = async (data) => {
        setOnUpdate(true);
        setUpdatingData(data);
    }


    useEffect(() => {
        const get_services = async () => {
            const data = await get_data('/services', page);
        
            //exclude the barber's password
            if (data) {
                setServices(data.services);
                setPaginationLimit(data.pageCount);
            }
        };
        get_services();
    }, [page]);

    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tighter text-gray-800">Service Management</h1>
                    <p className="text-xs text-gray-500">Handle barbershop's services efficiently.</p>
                </header>

                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input 
                                    type="text"
                                    placeholder="Search service (Service Name, Price)..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            <button 
                                className="flex items-center gap-2 bg-gray-700 py-2 px-4 text-white rounded-full tracking-tighter text-sm"
                                onClick={() => setAddingService(true)}
                            > 
                                <FaUserPlus /> 
                                Add Service 
                            </button>
                        </div>

                        <div className="w-full bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 tracking-tight">Services Table</h2>

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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Service Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Duration</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Service Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEmployees.map((service) => (
                                        <tr key={service._id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{service?.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{service?.duration} minutes</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight text-left">₱ {service?.price}.00</td>
                                            <td 
                                                className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight" 
                                                style={service?.role === 'Package Service' ? { color: 'green' } : { color: 'blue' } }
                                            >
                                                {service?.serviceType}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex justify-left items-center gap-2">
                                                    <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_update(service)}>
                                                        <FaEdit size={17} />
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_delete(service?._id)}>
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

            {onUpdate && updatingData && 
                <UpdateService 
                    currentData={updatingData} 
                    onCancel={setOnUpdate} 
                    setUpdatedData={setServices}
                    route={'/update_service'}
                />
            }

            {addingService && 
                <NewService 
                    setUpdatedData={setServices}
                    onCancel={setAddingService} 
                    route={'/new_service'}
                />
            }
        </div>
    );
};

export default Services;