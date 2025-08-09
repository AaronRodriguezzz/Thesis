import React from "react";
import {
    FaUsers,
    FaCalendarCheck,
    FaMoneyBillWave,
    FaBoxOpen,
} from "react-icons/fa";
import { StatCard } from "../../components/DashboardCards";
import {
    ResponsiveContainer,
    YAxis,
    XAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    LineChart,
    Line,
    BarChart,
    Bar,
} from "recharts";
import { useAdminPageProtection } from "../../hooks/useUser";

const DashboardStats = () => {
    useAdminPageProtection();
    const dailySalesData = [
            { date: 1, sales: 1200 },
            { date: 2, sales: 950 },
            { date: 3, sales: 1300 },
            { date: 4, sales: 1250 },
            { date: 5, sales: 1400 },
            { date: 6, sales: 1100 },
            { date: 7, sales: 1350 },
            { date: 8, sales: 1500 },
            { date: 9, sales: 1600 },
            { date: 10, sales: 1450 },
            { date: 11, sales: 1550 },
            { date: 12, sales: 1400 },
            { date: 13, sales: 1350 },
            { date: 14, sales: 1600 },
            { date: 15, sales: 1700 },
            { date: 16, sales: 1650 },
            { date: 17, sales: 1550 },
            { date: 18, sales: 1500 },
            { date: 19, sales: 1600 },
            { date: 20, sales: 1750 },
            { date: 21, sales: 1800 },
            { date: 22, sales: 1700 },
            { date: 23, sales: 1650 },
            { date: 24, sales: 1720 },
            { date: 25, sales: 1600 },
            { date: 26, sales: 1500 },
            { date: 27, sales: 1400 },
            { date: 28, sales: 1300 },
            { date: 29, sales: 1450 },
            { date: 30, sales: 1550 },
            { date: 31, sales: 1600 }
        ];

        const hourlySalesData = [
            { hour: '8 AM', sales: 200 },
            { hour: '9 AM', sales: 300 },
            { hour: '10 AM', sales: 450 },
            { hour: '11 AM', sales: 500 },
            { hour: '12 PM', sales: 600 },
            { hour: '1 PM', sales: 800 },
            { hour: '2 PM', sales: 700 },
            { hour: '3 PM', sales: 750 },
            { hour: '4 PM', sales: 850 },
            { hour: '5 PM', sales: 900 },
            { hour: '6 PM', sales: 650 },
            { hour: '7 PM', sales: 500 },
            { hour: '8 PM', sales: 400 }
        ];

    return (
        <div className="h-full px-4 py-6 space-y-8">
        {/* Stat cards */}
            <div className="flex flex-wrap gap-4 w-full">
                <StatCard
                    title="Customers"
                    value="15"
                    icon={<FaUsers className="text-white" />}
                    iconBg="bg-blue-500"
                />
                <StatCard
                    title="Appointments Today"
                    value="10"
                    icon={<FaCalendarCheck className="text-white" />}
                    iconBg="bg-green-500"
                />
                <StatCard
                    title="Weekly Revenue"
                    value="₱ 56,030.00"
                    icon={<FaMoneyBillWave className="text-white" />}
                    iconBg="bg-yellow-500"
                />
                <StatCard
                    title="Products Sold"
                    value="56"
                    icon={<FaBoxOpen className="text-white" />}
                    iconBg="bg-purple-500"
                />
            </div>

            {/* Main charts layout */}
            <div className="flex flex-col lg:flex-row gap-6 w-full h-[700px]">
            {/* Left: Line Chart (Big) */}
                <div className="flex-2 bg-white rounded-lg p-4 shadow-md">
                    <h2 className="text-lg font-semibold mb-2">Daily Sales</h2>
                    <ResponsiveContainer width="100%" height="95%">
                        <LineChart data={dailySalesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="black" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Right: Bar Chart for Peak Hours */}
                <div className="flex-1 bg-white rounded-lg p-4 shadow-md">
                    <h2 className="text-lg font-semibold mb-2">Peak Hours</h2>
                    <ResponsiveContainer width="100%" height="95%">
                        <BarChart data={hourlySalesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="black" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
    