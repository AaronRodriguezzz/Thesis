import React from "react";
import { FaUsers, FaCalendarCheck, FaMoneyBillWave, FaBoxOpen } from "react-icons/fa";

const DashboardStats = () => {
  return (
    <div>
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
    </div>
    
  );
};

const StatCard = ({ title, value, icon, iconBg }) => (
  <div className="flex-1 min-w-[220px] bg-white p-4 rounded-md shadow-md flex items-center gap-4">
    <div className={`p-3 rounded-full ${iconBg}`}>
      {icon}
    </div>
    <div>
      <h2 className="text-md font-semibold text-gray-600">{title}</h2>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default DashboardStats;