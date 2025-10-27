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
        <div>
            <main className="p-4">
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="w-full bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input 
                                    type="text"
                                    placeholder="Search service (Service Name, Price)..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder:text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="w-full bg-black/40 border text-white border-white/10 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 tracking-tight">Sales Table</h2>

                            <div className="flex justify-between items-center my-4 text-sm">
                                <div>
                                    <select 
                                        name="filter" 
                                        value={filterValue} 
                                        className="p-2 w-[200px] border border-white bg-black rounded-md outline-0 tracking-tight text-xs"
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

                            <div className="overflow-auto h-[530px] w-full custom-scrollbar">
                                {filterValue === 'Service' ?  (
                                    <table className="min-w-full divide-y divide-black/20">
                                        <thead className="bg-black/60 text-white py-3">
                                            <tr className="px-4 py-3 text-xs font-medium uppercase tracking-tight">
                                                <th>Service Name</th>
                                                <th>Branch</th>
                                                <th>Service</th>
                                                <th>Amount</th>
                                                <th>Method</th>
                                                <th>Date of Sale</th>
                                                <th>Recorded By</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-black/40 divide-y divide-black/20 text-white">
                                            {serviceSales && serviceSales.map((service, index) => (
                                                <tr className="px-4 py-4 whitespace-nowrap text-sm text-white tracking-tight text-center" key={index}>
                                                    <td>{service?.customer || 'N/A'}</td>
                                                    <td>{service.branch?.name}</td>
                                                    <td>{service.service?.name}</td>
                                                    <td>₱ {service?.price}.00</td>
                                                    <td 
                                                        className='px-4 py-4 whitespace-nowrap text-sm tracking-tight'
                                                        style={{ color: service?.paymentMethod === 'Cash' ? '#22c55e' : '#3b82f6'}}
                                                    >
                                                        {service?.paymentMethod}
                                                    </td>
                                                    <td>{service?.dateOfSale.toString().split('T')[0]}</td>
                                                    <td>{service.recordedBy?.fullName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="min-w-full divide-y divide-black/20">
                                        <thead className="bg-black/60 text-white py-3">
                                            <tr className="px-4 py-3 text-xs font-medium uppercase tracking-tight">
                                                <th>Sales Date</th>
                                                <th>Sold By</th>
                                                <th>Products/Qty</th>
                                                <th>Branch</th>
                                                <th>Total Price</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-black/40 divide-y divide-black/20 text-white">
                                            {productSales && productSales.map((sales, index) => (
                                                <tr className="px-4 py-4 whitespace-nowrap text-sm text-white tracking-tight text-center" key={index}>
                                                    <td>{sales?.createdAt.split('T')[0]}</td>
                                                    <td >{sales.soldBy?.fullName}</td>
                                                    <td className="truncate max-w-[200px]">
                                                        {sales.products.map((prod) => {
                                                            let productList = '';
                                                            return productList += `${prod.product?.name} (${prod?.quantity}), `
                                                        })}
                                                    </td>
                                                    <td >{sales.branch?.name}</td>
                                                    <td >₱ {sales?.totalPrice}.00</td>
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