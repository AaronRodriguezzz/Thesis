import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 p-6 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
