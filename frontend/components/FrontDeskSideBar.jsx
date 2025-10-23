import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";
import {
  MdDashboard,
  MdCalendarToday,
  MdPeople,
  MdOutlineLogout,
  MdShoppingCart,
  MdInventory,
  MdPerson
} from "react-icons/md";

const FrontDeskSideBar = () => {
  const navigate = useNavigate();
  const { logout, loading } = useAuth();

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/front-desk/dashboard" },
    { name: "Appointments", icon: <MdCalendarToday />, path: "/front-desk/appointments" },
    { name: "Queueing", icon: <MdPeople />, path: "/front-desk/queueing" },
    { name: "Customers", icon: <MdPeople />, path: "/front-desk/customers" },
    { name: "POS", icon: <MdInventory />, path: "/front-desk/POS" },
    { name: "Sales", icon: <MdShoppingCart />, path: "/front-desk/sales" },
  ];


  return (
  <div className="w-50 h-[calc(100vh-3rem)] bg-black/50 text-white flex flex-col justify-between fixed left-4 top-6 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 z-20">
      <div>
        <h2 className="text-2xl font-extralight p-4 border-b border-gray-700 tracking-tighter">TOTO TUMBS BARBERSHOP</h2>
        <ul className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 hover:bg-gray-700 hover:text-white tracking-tighter transition rounded-lg ${
                    isActive ? "bg-white text-black shadow-lg" : ""
                  }`
                }
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded disabled:cursor-not-allowed transition-shadow shadow-sm hover:shadow-md"
          disabled={loading}

        >
          <MdOutlineLogout className="text-xl mr-2" />
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default FrontDeskSideBar;
