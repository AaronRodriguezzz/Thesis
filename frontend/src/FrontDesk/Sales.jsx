import React, { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { time } from "../../data/TimeData";
import { useAdminPageProtection } from "../../hooks/userProtectionHooks";

const Sales = ({ isViewing }) => {
    // useAdminPageProtection();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [salesList, setSalesList] = useState([]);
    const [filterValue, setFilterValue] = useState('');

    const filteredSales = useMemo(() => {
        return salesList && salesList.filter(sales =>
            sales.customer?.lastName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            sales.customer?.firstName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            sales.service?.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            sales.additionalService?.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            sales.branch?.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            sales.barber?.fullName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            sales.scheduledDate?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            sales.scheduledTime?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [salesList, searchTerm]);


    useEffect(() => {
        const get_employees = async () => {
            const data = await get_data(`/sales`, page);

            //exclude the barber's password
            if (data) {
                console.log(data.sales);
                setSalesList(data.sales);
                setPaginationLimit(data.pageCount);
            }
        };
        get_employees();
    }, [page]); 

    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">
                <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tighter text-gray-800">Sales Summary</h1>
                <p className="text-xs text-gray-500">Access your sales for product and services.</p>
                </header>

                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        {!isViewing && <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input 
                                    type="text"
                                    placeholder="Search sales information (ex. Name, Service, Product...)"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>}

                        <div className="w-full bg-white p-6 rounded-lg shadow">

                            <h2 className="text-xl font-semibold mb-4 tracking-tight">Sales Table</h2>
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
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Sales Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Sold By</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Products/Qty</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Branch</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Total Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {salesList && filteredSales.map((sales, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{sales?.createdAt.split('T')[0]}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{sales.soldBy?.fullName}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">
                                                    {sales.products.map((prod) => {
                                                        let productList = '';
                                                        return productList += `${prod.product?.name} (${prod?.quantity}), `
                                                    })}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{sales.branch?.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{sales?.totalPrice}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{sales?.service?.name}</td>
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

export default Sales;