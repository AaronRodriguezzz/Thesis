import React, { useEffect, useState } from "react";
import { useCustomerPageProtection, useUserProtection} from "../../hooks/userProtectionHooks";
import { MdCalendarToday, MdDirectionsWalk } from "react-icons/md";
import { queueSocket } from "../../services/SocketMethods";
import { get_data } from "../../services/GetMethod";
import { FaUserCircle } from 'react-icons/fa';

export default function BarberStatusPage() {
  // useCustomerPageProtection();
  // useUserProtection();
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [currentHour, setCurrentHour] = useState(0);
  const [barberList, setBarberList] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [walkInList, setWalkInList] = useState(null);

  const formatTime = (date) => {
    const hours = date.getHours();
    const rawHours = hours % 12 || 12;
    const formattedHours = rawHours.toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const hourNow = new Date().getHours();
  
      if (hourNow !== currentHour) {
        setCurrentHour(hourNow);
      }
              
    }, 5 * 60 * 1000);
  
    return () => clearInterval(interval); 
  }, [currentHour]);


  useEffect(() => {
          // When we connect
    queueSocket.on("connect", () => {
      console.log("Connected to queueing namespace");
    });

    // frontDesk?.branchAssigned
    const branchId = '6862a4bed08d2b82975b2ac6';
    const fetchInitialData = async () => await get_data(`/initialBarberAssignment/${branchId}`)
  
    fetchInitialData();
          
    // Listen for new appointments    
    queueSocket.on("queueUpdate", (data) => {
      setBarberList(data?.barbers || []);
      setAppointments(data?.appointments || []);
      setWalkInList(data.walkIns || []);
    });
          
    return () => {
      queueSocket.off("connect");
      queueSocket.off("queueUpdate");
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
    setTime(formatTime(today));
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-gray-100 bg-[url('/login.png')] bg-cover bg-center">

      <main className="h-full w-full flex flex-col items-center">
        <div className="w-[90%] md:w-[95%] lg:w-[75%] flex justify-between items-center leading-3 bg-white p-4 my-4 shadow rounded">
          <div className="leading-0.5">
            <h1 className="text-s md:text-[20px] lg:text-[30px] tracking-tighter text-left my-4">
              TOTO TUMBS STUDIO
            </h1>
            <p className="text-xs md:text-[20px]">119 Ballecer South Signal Taguig City</p>
          </div>
          <h2 className="text-xs md:text-[20px]  lg:text-[30px] font-extralight tracking-tighter text-center my-4">
            {date} {time}
          </h2>
        </div>

        <div className="w-[90%] md:w-[95%] lg:w-[75%] flex gap-x-2 items-center justify-between leading-3 mb-4">
          <div className="w-[50%] flex items-center bg-white gap-8 p-4 shadow-md">
            <MdCalendarToday className="text-[40px] text-gray-800" />
        
            <div>
              <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter text-left my-2">
                Appointment
              </h1>
              <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-left">
                {appointments && appointments.filter(a => a.status === 'Booked' && a.scheduledTime === currentHour).length || 0}
              </p>
            </div>
          </div>
        
          <div className="w-[50%] flex items-center justify-between bg-white gap-4 px-4 py-4 shadow-md">
            <div className="flex">
              <MdDirectionsWalk className="text-[50px] text-gray-800" />
              <div>
                <h2 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter text-left my-2">
                  Walk-In
                </h2>
                <h3 className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-left">
                 {walkInList && walkInList.length || 0}  
                </h3>
              </div>
            </div>
          </div>                    
        </div>  

        <div className="w-full h-auto md:h-[60%] flex flex-col md:flex-row items-center justify-center gap-4 px-4">
          {barberList && barberList.map((barber, index) => {
            // Decide badge color
            let statusColor = "text-red-600"; // default
            if (barber?.status === "Available" || barber?.status === "Barbering") {
              statusColor = "text-green-600";
            } else if (barber?.status === "On-break") {
              statusColor = "text-orange-500";
            }

            return (
              <div
                key={index}
                className="h-full w-[90%] md:w-[35%] lg:w-[25%] flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4"
              >
                {barber?.imagePath ? (
                  <img
                    src={`${baseUrl}/${barber.imagePath}`}
                    alt={`${barber.fullName} profile`}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                ) : (
                  <FaUserCircle className="text-[120px] text-gray-800 mb-3" />
                )}

                <h1 className="text-[30px] font-semibold tracking-tight text-center">
                  {barber.fullName}
                </h1>

                <span
                  className={`block w-[80%] text-center text-lg font-medium px-2 py-1 mx-auto rounded-full ${statusColor}`}
                >
                  {barber.status}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
