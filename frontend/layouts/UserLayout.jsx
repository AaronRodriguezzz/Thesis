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
  
  const [announcementExist, setAnnouncementExist] = React.useState(false);

  return (
    <div>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dk3bbinj9/image/upload/login_h4ifyf')] bg-cover bg-center filter invert" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <Navigation otherPage={true}/>
      <Announcement /> 
      <main className="overflow-x-hidden py-25 z-10">
        <Outlet />
        <HaircutSuggestionBtn/>
        <Chatbot/>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
