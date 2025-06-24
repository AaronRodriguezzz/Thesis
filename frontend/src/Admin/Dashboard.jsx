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
  PieChart,
  Pie,
  BarChart,
  Bar,
} from "recharts";

const DashboardStats = () => {
  const salesData = [
    { name: "Jan", thisYear: 24000, lastYear: 12000 },
    { name: "Feb", thisYear: 22100, lastYear: 11000 },
    { name: "Mar", thisYear: 22900, lastYear: 13000 },
    { name: "Apr", thisYear: 20000, lastYear: 10000 },
    { name: "May", thisYear: 21810, lastYear: 11500 },
    { name: "Jun", thisYear: 25000, lastYear: 13500 },
    { name: "Jul", thisYear: 21000, lastYear: 12500 },
    { name: "Aug", thisYear: 28000, lastYear: 15000 },
    { name: "Sep", thisYear: 26500, lastYear: 14000 },
    { name: "Oct", thisYear: 30000, lastYear: 16000 },
    { name: "Nov", thisYear: 32000, lastYear: 17000 },
    { name: "Dec", thisYear: 35000, lastYear: 18000 },
  ];

  const branchSales = [
    { subject: "South Signal", Revenue: 95000 },
    { subject: "North Signal", Revenue: 88000 },
    { subject: "Central Bicutan", Revenue: 100000 },
    { subject: "Hagonoy", Revenue: 75000 },
  ];

  const appointments = [
    { status: "Completed", total: 150 },
    { status: "Cancelled", total: 25 },
    { status: "No Show", total: 10 },
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
      <div className="flex flex-col lg:flex-row gap-6 w-full h-[550px]">
        {/* Left: Line Chart (Big) */}
        <div className="flex-1 bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lastYear" stroke="#1F2937" />
              <Line type="monotone" dataKey="thisYear" stroke="#1F2937" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Pie + Bar Charts stacked vertically */}
        <div className="flex flex-col gap-6 w-full lg:w-[40%]">
          {/* Bar Chart - Appointment Status (Moved to Top) */}
          <div className="bg-white rounded-lg p-4 shadow-md h-[48%]">
            <h2 className="text-lg font-semibold mb-2">Appointment Status</h2>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={appointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#1F2937" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Branch Revenue (Moved to Bottom) */}
          <div className="bg-white rounded-lg p-4 shadow-md h-[48%]">
            <h2 className="text-lg font-semibold mb-2">Branch Revenue</h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={branchSales}
                  dataKey="Revenue"
                  nameKey="subject"
                  outerRadius={80}
                  fill="#1F2937"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
  