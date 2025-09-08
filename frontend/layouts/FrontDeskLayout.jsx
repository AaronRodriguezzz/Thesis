import React from "react";
import FrontDeskSideBar from "../components/FrontDeskSideBar";
import { Outlet } from "react-router-dom";
import { useAdminPageProtection } from "../hooks/userProtectionHooks";
import AdminHeader from "../components/ui/AdminHeader";

const FrontDeskLayout = () => {
  useAdminPageProtection();
      
  return (
    <div className="flex">
      <FrontDeskSideBar />
      <main className="ml-42 p-6 h-screen w-full bg-gray-100 overflow-x-hidden">
        <AdminHeader/>
        <Outlet />
      </main>
    </div>
  );    
};

export default FrontDeskLayout;
