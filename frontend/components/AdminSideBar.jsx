import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";
import {
  MdDashboard,
  MdCalendarToday,
  MdPeople,
  MdStore,
  MdLogin,
  MdOutlineLogout,
  MdShoppingCart,
  MdDesignServices,
  MdInventory,
  MdLocationOn,
} from "react-icons/md";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout, loading } = useAuth();

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/admin/dashboard" },
    { name: "Appointments", icon: <MdCalendarToday />, path: "/admin/appointments" },
    { name: "Customers", icon: <MdPeople />, path: "/admin/customers" },
    { name: "Employees", icon: <MdStore />, path: "/admin/employees" },
    { name: "Products", icon: <MdInventory />, path: "/admin/products" },
    { name: "Sales", icon: <MdShoppingCart />, path: "/admin/sales" },
    { name: "Services", icon: <MdDesignServices />, path: "/admin/services" },
    { name: "Branches", icon: <MdLocationOn />, path: "/admin/branches" },
  ];

  return (
    <div className="w-48 h-screen bg-gray-900 text-white flex flex-col justify-between fixed">
      <div>
        <h2 className="text-2xl font-extralight p-4 border-b border-gray-700 tracking-tighter">TOTO TUMBS BARBERSHOP</h2>
        <ul className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 hover:bg-gray-700 tracking-tighter transition ${
                    isActive ? "bg-gray-800" : ""
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
          className="flex items-center w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded disabled:cursor-not-allowed"
          disabled={loading}
        >
          <MdOutlineLogout className="text-xl mr-2" />
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
