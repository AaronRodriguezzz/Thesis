import React from "react";
import Navigation from "../components/NavBar"; // or UserNavBar
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <Navigation otherPage={true}/>
      <main className="overflow-x-hidden pt-20">
        <Outlet />
        <Chatbot/>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
