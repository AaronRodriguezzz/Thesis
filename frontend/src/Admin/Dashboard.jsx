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
import DashboardLoading from "../../components/animations/DashboardLoading";

const Dashboard = () => {
    const user = useUser();
    const [productsSales, setProductSales] = useState([]);
    const [serviceSales, setServiceSales] = useState([]);
    const [cardData, setCardData] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [peakHours, setPeakHours] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            if (!user) return; // wait for user to exist

            try{
                setLoading(true);

                const [cards, chart] = await Promise.all([
                    get_data('/card-data'),
                    get_data('/chart-data')
                ])

                if (cards && chart) {
                    setProductSales(cards.productsSales)
                    setServiceSales(cards.serviceSales)
                    setSalesData(chart.salesChart)
                    setPeakHours(chart.peakHours);
                    setCardData({
                        totalProductSales: cards.totalProductSales,
                        servicesCompleted: cards.servicesCompleted,
                        totalCustomers: cards.totalCustomers,
                        appointmentsToday: cards.appointmentsToday.length
                    })
                }
            }catch(err){
                console.log(err.message);
            }finally{
                setLoading(false);
            }
        };

        getData();
    }, [user]);

    if(loading || !user){
        return <DashboardLoading />
    }

    return (
        <div className="p-6 space-y-8">
            {/* 🔝 Top StatCards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Product Sales"
                    value={`₱${cardData?.totalProductSales || 0}`}
                    icon={FaMoneyBillWave}
                    color="green"
                />
                <StatCard
                    title="Services Completed"
                    value={cardData?.servicesCompleted || 0}
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
                <div className="bg-black/40 text-white border border-white/10 rounded-2xl shadow-md p-4">
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
                <div className="bg-black/40 text-white border border-white/10 rounded-2xl shadow-md p-4">
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
            <div className="bg-black/40 text-white border border-white/10 rounded-2xl shadow-md p-4">
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

            {!loading && <Sales isExtended={true}  pSales={productsSales} sSales={serviceSales}/>}
        </div>
    );
};

export default Dashboard;
