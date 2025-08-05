import React, { useEffect, useState } from "react";
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
  Area,
  AreaChart
} from "recharts";
import { get_data } from "../../services/GetMethod";

const DashboardStats = () => {

  const [cardsData, setCardsData] = useState(null);
  const [graphData, setGraphData] = useState({
    monthlySales: [],
    appointmentByStatus: [],
    revenueByBranch: [],
  });

  const data = [
    { totalRevenue: 1600, date: '2025-07-29' },
    { totalRevenue: 400, date: '2025-08-05' },
    { totalRevenue: 4000, date: '2025-09-05' },
    { totalRevenue: 10000, date: '2025-10-05' },
    { totalRevenue: 9000, date: '2025-11-05' },
    { totalRevenue: 1220, date: '2025-12-05' }
  ]
  
  useEffect(() => {
    const initializeData = async () => {
      try{
        const [cardData, graphData] = await Promise.all([
          get_data('/card-data'),
          get_data('/graph-data')
        ])

        if(cardData && graphData){
          console.log(graphData);
          setGraphData({
            monthlySales: graphData?.totalRevenue,
            appointmentByStatus: graphData?.appointmentByStatus,
            revenueByBranch: graphData?.revenueByBranch,
          })
          setCardsData(cardData)
        }

      }catch(err){
        console.log(err);
      }
    }

    initializeData();
  },[])


  return (
    <div className="h-full px-4 py-6 space-y-8">
      {/* Stat cards */}
      <div className="flex flex-wrap gap-4 w-full">
        <StatCard
          title="Customers"
          value={cardsData?.customers}
          icon={<FaUsers className="text-white" />}
          iconBg="bg-blue-500"
        />
        <StatCard
          title="Appointments this Month"
          value={cardsData?.appointmentsThisMonth}
          icon={<FaCalendarCheck className="text-white" />}
          iconBg="bg-green-500"
        />
        <StatCard
          title="Monthly Service Revenue"
          value={`₱ ${cardsData?.monthlyRevenue}.00`}
          icon={<FaMoneyBillWave className="text-white" />}
          iconBg="bg-yellow-500"
        />
        <StatCard
          title="Products Revenue"
          value={`₱ ${cardsData?.productRevenue}.00`}
          icon={<FaBoxOpen className="text-white" />}
          iconBg="bg-purple-500"
        />
      </div>

      {/* Main charts layout */}
      <div className="flex flex-col lg:flex-row gap-6 w-full h-[700px]">
        {/* Left: Line Chart (Big) */}
        <div className="flex-1 bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Monthly Sales</h2>
          {/* <ResponsiveContainer width="100%" height="90%">
            <LineChart data={graphData.monthlySales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lastYear" stroke="#1F2937" />
            </LineChart>
          </ResponsiveContainer> */}

          <ResponsiveContainer width="100%" height="90%">
            <AreaChart
              width={500}
              height={200}
              data={data}
              syncId="anyId"
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="totalRevenue" fill="#1F2937" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Pie + Bar Charts stacked vertically */}
        <div className="flex flex-col gap-6 w-full lg:w-[40%]">
          {/* Bar Chart - Appointment Status (Moved to Top) */}
          <div className="bg-white rounded-lg p-4 shadow-md h-[48%]">
            <h2 className="text-lg font-semibold mb-2">Appointment Status</h2>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={graphData.appointmentByStatus}>
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
                  data={graphData.revenueByBranch}
                  dataKey="totalRevenue"
                  nameKey="branch"
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
  