import React from "react";
import FrontDeskSideBar from "../components/FrontDeskSideBar";
import { Outlet } from "react-router-dom";
import { useAdminPageProtection } from "../hooks/userProtectionHooks";
import AdminHeader from "../components/ui/AdminHeader";

const FrontDeskLayout = () => {
  useAdminPageProtection();
  
  return (
    <div className="flex">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dk3bbinj9/image/upload/login_h4ifyf')] bg-cover bg-center filter invert" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <FrontDeskSideBar />
      <main className="pl-60 p-5 h-screen w-full overflow-x-hidden z-10">
        <AdminHeader/>
        <Outlet />
      </main>
    </div>
  );    
};

export default FrontDeskLayout;
