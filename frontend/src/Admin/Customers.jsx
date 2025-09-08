import React, { useEffect, useState, useMemo } from "react";
import { FaUsers, FaUserPlus, FaSearch, FaEdit, FaBan  } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { delete_data } from "../../services/DeleteMethod";
import CustomerUpdateModal from "../../components/modal/UpdateCustomerModal";
import { update_data } from "../../services/PutMethod";

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


    const handle_disable = async (id) => {
        if(!window.confirm("Are you sure you want to disable this customer?")) return 

        const data = await update_data(`/disable_customer/${id}`);

        if (data.customer) {
            setCustomersList(prev => prev.map(customer => customer._id === id ? data.customer : customer ));
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

                        <div className="flex justify-between items-center my-4 text-sm">
                            <h2 className="text-xl font-semibold mb-4 tracking-tight">Customer Table</h2>

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
                                                    <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_disable(customer?._id)}>
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