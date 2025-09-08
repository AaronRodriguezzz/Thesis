import React from "react";
import AdminSidebar from "../components/AdminSideBar";
import PopUpNotification from "../components/NotifPopup";
import { Outlet } from "react-router-dom";
import { useUserProtection, useAdminPageProtection} from "../hooks/userProtectionHooks";
import AdminHeader from "../components/ui/AdminHeader";

const AdminLayout = () => {
  useAdminPageProtection();

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-42 p-6 h-screen w-full bg-gray-100 overflow-x-hidden">
        <AdminHeader />
        <Outlet />
      </main>
      <PopUpNotification />
    </div>
  );
};

export default AdminLayout;
