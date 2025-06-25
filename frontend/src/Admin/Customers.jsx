import React, { useEffect, useState, useMemo } from "react";
import { FaUsers, FaUserPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { delete_data } from "../../services/DeleteMethod";
import CustomerUpdateModal from "../../components/modal/UpdateCustomerModal";

const Customers = () => {
 
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [customersList, setCustomersList] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);

    const filteredCustomers = useMemo(() => {
        return customersList && customersList.filter(customer =>
            customer?.lastName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.firstName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.phone.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.email.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.status.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customersList, searchTerm]);


    const handle_delete = async (id) => {
        const data = await delete_data(id, '/delete_customer');

        if (data.deleted) {
            setCustomersList(prev => prev.filter(customer => customer._id !== id));
        }
    }

    const handle_update = async (data) => {
        setOnUpdate(true);
        setUpdatingData(data);
    }


    useEffect(() => {
        const get_customers = async () => {
            const data = await get_data('/get_customers', page);
        
            //exclude the barber's password
            if (data) {
                setCustomersList(data.customers);
                setPaginationLimit(data.pageCount);
            }
        };

        get_customers();
    }, [page]);

    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tighter text-gray-800">Customer Management</h1>
                    <p className="text-xs text-gray-500">Oversee your customers and manage them efficiently.</p>
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
                        </div>

                        <div className="w-full bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 tracking-tight">Customer Table</h2>

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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Full Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Phone</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer._id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{customer?.lastName}, {customer?.firstName}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{customer?.phone}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight text-left">{customer?.email}</td>
                                            <td 
                                                className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight" 
                                                style={customer.status === 'Active' ? { color: 'green' } : { color: 'red' } }
                                            >
                                                {customer?.status}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_update(customer)}>
                                                        <FaEdit size={17} />
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_delete(customer?._id)}>
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
                <CustomerUpdateModal 
                    currentData={updatingData} 
                    onCancel={setOnUpdate} 
                    setUpdatedData={setCustomersList}
                    route={'/update_customer'}
                />
            }
        </div>
    );
};

export default Customers;