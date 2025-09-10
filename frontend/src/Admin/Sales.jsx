import React, { useEffect, useState } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import ViewSalesModal from "../../components/modal/ViewProductSales";

const Sales = ({ isExtended = false, sSales = [], pSales = [] }) => {
 
    const [serviceSales, setServiceSales] = useState(sSales);
    const [productSales, setProductSales] = useState(pSales);
    const [searchTerm, setSearchTerm] = useState("");
    const [productSalesPage, setProductSalesPage] = useState(1);
    const [serviceSalesPage, setServiceSalesPage] = useState(1);
    const [psPageLimit, setPsPageLimit] = useState(1);
    const [ssPageLimit, setSsPageLimit] = useState(1);
    const [filterValue, setFilterValue] = useState('Product');
    const [saleView, setSaleView] = useState(false);
    const [saleToView, setSaleToView] = useState(null);


    useEffect(() => {

        if(isExtended || filterValue !== 'Service' ) return

        const get_services = async () => {
            const data = await get_data('/sales/services', serviceSalesPage, searchTerm);
                    
            if (data) {
                console.log('services', data.sales);
                setServiceSales(data.sales);
                setSsPageLimit(data.pageCount);
            }
        };
        get_services();
    }, [serviceSalesPage, filterValue, searchTerm]);

    useEffect(() => {

        console.log(searchTerm);

        if(isExtended || filterValue !== 'Product' ) return

        const getSales = async () => {
            const data = await get_data(`/sales/products`, productSalesPage, searchTerm);
    
                //exclude the barber's password
            if (data) {
                setProductSales(data.sales);
                setPsPageLimit(data.pageCount);
            }
        };
        
        getSales();
    }, [productSalesPage, filterValue, searchTerm]); 

    

    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">
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
                        </div>

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
                                        <option value="Product">Product</option>
                                        <option value="Service">Service</option>
                                    </select>
                                </div>

                                {!isExtended && <Pagination
                                    count={filterValue === 'Product' ? psPageLimit : ssPageLimit}
                                    size="small"
                                    page={filterValue === 'Product' ? productSalesPage : serviceSalesPage}
                                    onChange={(event, value) => { 
                                        if(filterValue === 'Product') setProductSalesPage(value)
                                        else setServiceSalesPage(value)
                                    }}
                                />}
                            </div>

                            <div className="overflow-x-auto min-h-[400px] max-h-[600px] w-full">
                                {filterValue === 'Service' ?  (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Service Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Branch</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Service</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Method</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Date of Sale</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Recorded By</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {serviceSales && serviceSales.map((service) => (
                                                <tr key={service._id}>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{service?.customer || 'N/A'}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{service.branch?.name}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{service.service?.name}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight text-left">₱ {service?.price}.00</td>
                                                    <td 
                                                        className='px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight'
                                                        style={{ color: service?.paymentMethod === 'Cash' ? '#22c55e' : '#3b82f6'}}
                                                    >
                                                        {service?.paymentMethod}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{service?.dateOfSale.toString().split('T')[0]}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{service.recordedBy?.fullName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
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
                                            {productSales && productSales.map((sales, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{sales?.createdAt.split('T')[0]}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{sales.soldBy?.fullName}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight truncate max-w-[200px]">
                                                        {sales.products.map((prod) => {
                                                            let productList = '';
                                                            return productList += `${prod.product?.name} (${prod?.quantity}), `
                                                        })}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{sales.branch?.name}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">₱ {sales?.totalPrice}.00</td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <button onClick={() => {
                                                                setSaleView(true)
                                                                setSaleToView(sales)
                                                            }}
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ViewSalesModal 
                isOpen={saleView} 
                onClose={() => setSaleToView(false)} 
                sale={saleToView} 
            />

        </div>
    );
};

export default Sales;