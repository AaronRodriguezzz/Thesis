import React from "react";
import Navigation from "../components/NavBar"; // or UserNavBar
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import HaircutSuggestionBtn from "../components/HaircutSuggestionBtn";
import Announcement from "../components/ui/Announcement";
import { Outlet } from "react-router-dom";
import { useUserProtection } from "../hooks/userProtectionHooks";

const UserLayout = () => {
  useUserProtection();
  
  return (
    <div>
<div className="fixed inset-0 -z-10 overflow-hidden">
        {/* This inner div only applies the invert filter to the background image */}
        <div className="absolute inset-0 bg-[url('./login.png')] bg-cover bg-center filter invert" />
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <Navigation otherPage={true}/>
      <Announcement /> 
      <main className="overflow-x-hidden pt-20 z-10">
        <Outlet />
        <HaircutSuggestionBtn/>
        <Chatbot/>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
