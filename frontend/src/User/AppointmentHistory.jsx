import React, { useState, useEffect } from "react";
import Navigation from "../../components/NavBar";
import { get_data } from "../../services/GetMethod";
import { HistoryCard } from "../../components/UserHistoryCard";
import { useCustomerPageProtection, useUserProtection } from '../../hooks/useUser';

const AppointmentHistory = () => {
  useCustomerPageProtection();
  useUserProtection();

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      service: "Haircut + Beard Trim",
      date: "2025-06-15 3:00 PM",
      status: "Completed",
    },
    {
      id: 2,
      service: "Haircut Only",
      date: "2025-06-10 1:00 PM",
      status: "Cancelled",
    },
    {
      id: 3,
      service: "Beard Trim",
      date: "2025-06-01 5:00 PM",
      status: "Completed",
    },
    {
      id: 4,
      service: "Haircut + Beard Trim",
      date: "2025-06-20 2:00 PM",
      status: "Pending",
    },
  ]);

  useEffect(() => {
    const initializeData = async () => {
      try{
        const response = await get_data('/get_data/appointments');

        if(response){
          setAppointments(response)
        }
      }catch(err){
        console.log(err);
      }
    }

    initializeData();
  },[])
  

  return (
    <>
      <div className="h-screen max-w-4xl mx-auto p-6 mt-10">
        <h1 className="font-extralight text-[50px] text-center my-5">Appointment History</h1>

        {appointments && appointments.map((appointment) => (
          <HistoryCard 
            id={appointment.id}
            service={appointment.service}
            date={appointment.date}
            status={appointment.status}
          />
        ))}
      </div>
    </>
    
  );
};


export default AppointmentHistory;
