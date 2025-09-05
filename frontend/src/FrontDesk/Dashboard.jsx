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
import { get_data } from "../../services/GetMethod";
import { useUser } from "../../hooks/userProtectionHooks";
import Sales from "./Sales";

const Dashboard = () => {
    const user = useUser();
    const [productSales, setProductSales] = useState([]);
    const [cardData, setCardData] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [peakHours, setPeakHours] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const get_services = async () => {
            try{
                setLoading(true);

                const [cards, chart] = await Promise.all([
                    get_data(`/card-data/${user._id}`),
                    get_data('/chart-data')
                ])
                
                if (cards && chart) {
                    setProductSales(cards.productsSales)
                    setSalesData(chart.salesChart)
                    setPeakHours(chart.peakHours);
                    setCardData({
                        totalProductsSales: cards.totalProductSales,
                        totalServiceSales: cards.totalServiceSales,
                        totalCustomers: cards.totalCustomers,
                        appointmentsToday: cards.appointmentsToday
                    })
                }
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
            
        };
        get_services();
    }, []);

    if(loading || !user){
        return <div>Loading...</div>
    }

    return (
        <div className="p-6 space-y-8">
            {/* 🔝 Top StatCards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Service Sales"
                    value={`₱${cardData?.totalProductSales || 0}`}
                    icon={FaMoneyBillWave}
                    color="green"
                />
                <StatCard
                    title="Services Completed"
                    value={cardData?.totalServiceSales || 0}
                    icon={FaCut}
                    color="orange"
                />
                <StatCard
                    title="Customers Accounts"
                    value={cardData?.totalCustomers || 0}
                    icon={FaUserPlus}
                    color="blue"
                />
                <StatCard
                    title="Appointments Today"
                    value={cardData?.appointmentsToday || 0}
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
                    <Bar dataKey="service" fill="#1e3a8a" radius={[10, 10, 0, 0]} /> {/* Dark Blue */}
                    <Bar dataKey="product" fill="#b91c1c" radius={[10, 10, 0, 0]} /> {/* Dark Red */}
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
                    <Line type="monotone" dataKey="service" stroke="#1e3a8a" strokeWidth={3} /> {/* Dark Blue */}
                    <Line type="monotone" dataKey="product" stroke="#b91c1c" strokeWidth={3} /> {/* Dark Red */}
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>

            {/* 👥 Customers Per Hour Chart */}
            <div className="bg-white rounded-2xl shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Customers Per Hour (9 AM - 9 PM)</h2>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="customer" stroke="#1e3a8a" strokeWidth={3} dot /> {/* Dark Blue */}
                </LineChart>
                </ResponsiveContainer>
            </div>

            <Sales isViewing={true} />
        </div>
    );
};

export default Dashboard;
