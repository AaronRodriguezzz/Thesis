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
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/login.png')] bg-cover bg-center filter invert" />
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
