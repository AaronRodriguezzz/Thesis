import React, { useState, useEffect } from "react";
import Navigation from "../../components/NavBar";
import { get_data } from "../../services/GetMethod";
import { HistoryCard } from "../../components/UserHistoryCard";
import { useCustomerPageProtection, useUserProtection } from '../../hooks/userProtectionHooks';

const AppointmentHistory = () => {
  useCustomerPageProtection();
  useUserProtection();

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      try{
        const response = await get_data('/get_data/appointments');

        if(response){
          console.log(response);
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
            service={appointment.service.name}
            date={appointment.scheduledDate.toString().split('T')[0]}
            status={appointment.status}
          />
        ))}
      </div>
    </>
    
  );
};


export default AppointmentHistory;
