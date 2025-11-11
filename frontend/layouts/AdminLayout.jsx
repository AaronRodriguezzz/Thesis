import React from "react";
import AdminSidebar from "../components/AdminSideBar";
import PopUpNotification from "../components/NotifPopup";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/ui/AdminHeader";
import { useAdminPageProtection, useUserProtection } from "../hooks/userProtectionHooks";

const AdminLayout = () => {
  useAdminPageProtection();
  useUserProtection();
  
  return (
    <div className="flex">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dk3bbinj9/image/upload/login_h4ifyf')] bg-cover bg-center filter invert" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <AdminSidebar />
      <main className="ml-42 p-6 h-screen w-full overflow-x-hidden">
        <AdminHeader />
        <Outlet />
      </main>
      <PopUpNotification />
    </div>
  );
};

export default AdminLayout;
