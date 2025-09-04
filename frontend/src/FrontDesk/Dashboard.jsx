import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "../../components/DashboardCards";
import { FaMoneyBillWave, FaCut, FaUserPlus, FaCalendarAlt } from "react-icons/fa";

// Dummy data for charts
const salesData = [
  { month: "Jan", services: 1200, products: 800 },
  { month: "Feb", services: 1600, products: 950 },
  { month: "Mar", services: 1400, products: 1100 },
  { month: "Apr", services: 2000, products: 1200 },
  { month: "May", services: 1800, products: 1500 },
];

// Dummy customer per hour data
const customerPerHour = [
  { hour: "9 AM", customers: 5 },
  { hour: "10 AM", customers: 12 },
  { hour: "11 AM", customers: 15 },
  { hour: "12 PM", customers: 18 },
  { hour: "1 PM", customers: 14 },
  { hour: "2 PM", customers: 20 },
  { hour: "3 PM", customers: 25 },
  { hour: "4 PM", customers: 22 },
  { hour: "5 PM", customers: 30 },
  { hour: "6 PM", customers: 28 },
  { hour: "7 PM", customers: 18 },
  { hour: "8 PM", customers: 12 },
  { hour: "9 PM", customers: 8 },
];

const Dashboard = () => {
    const [salesList, setSalesList] = useState([]);
    const [pageCount, setPageLimit] = useState([]);
    
    useEffect(() => {
        const get_services = async () => {
            const data = await get_data('/sales/services', serviceSalesPage);
            
            if (data) {
                setSalesList(data.sales);
                setPageLimit(data.pageCount);
            }
        };
        get_services();
    }, [pageCount]);

    return (
        <div className="p-6 space-y-8">
        {/* 🔝 Top StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
            title="Total Sales"
            value="₱120,000"
            icon={FaMoneyBillWave}
            color="green"
            />
            <StatCard
            title="Services Completed"
            value="540"
            icon={FaCut}
            color="orange"
            />
            <StatCard
            title="New Customers"
            value="120"
            icon={FaUserPlus}
            color="blue"
            />
            <StatCard
            title="Appointments Today"
            value="45"
            icon={FaCalendarAlt}
            color="purple"
            />
        </div>

        {/* 📊 Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Monthly Sales (Bar)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="services" fill="#1e3a8a" radius={[10, 10, 0, 0]} /> {/* Dark Blue */}
                <Bar dataKey="products" fill="#b91c1c" radius={[10, 10, 0, 0]} /> {/* Dark Red */}
                </BarChart>
            </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Revenue Trend (Line)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="services" stroke="#1e3a8a" strokeWidth={3} /> {/* Dark Blue */}
                <Line type="monotone" dataKey="products" stroke="#b91c1c" strokeWidth={3} /> {/* Dark Red */}
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* 👥 Customers Per Hour Chart */}
        <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Customers Per Hour (9 AM - 9 PM)</h2>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customerPerHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="#1e3a8a" strokeWidth={3} dot /> {/* Dark Blue */}
            </LineChart>
            </ResponsiveContainer>
        </div>

        {/* 📋 Sales Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Service Sales</h2>
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
                        {salesList && salesList.map((sales, index) => (
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
    );
};

export default Dashboard;
