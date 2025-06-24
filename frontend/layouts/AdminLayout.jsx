import React from "react";
import AdminSidebar from "../components/AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-42 p-6 w-full bg-gray-50 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
