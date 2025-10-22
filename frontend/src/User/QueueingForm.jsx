import React, { useEffect, useState } from "react";
import { MdCalendarToday, MdDirectionsWalk } from "react-icons/md";
import { queueSocket } from "../../services/SocketMethods";
import { get_data } from "../../services/GetMethod";
import { FaUserCircle } from 'react-icons/fa';
import { timeFormat } from "../../utils/formatDate";

export default function BarberStatusPage() {
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [currentHour, setCurrentHour] = useState(0);
  const [barberList, setBarberList] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [walkInList, setWalkInList] = useState(null);

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
    const branchId = '6862a4bed08d2b82975b2ac6';
    
    const fetchInitialData = async () => {
  
      if(!branchId) return
  
      try {
        const response = await get_data(`/initialBarberAssignment/${branchId}`);

        setBarberList(response?.barbers || []);
        setAppointments(response?.appointments || []);
        setWalkInList(response?.walkIns || []);
  
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } 
    };
  
    fetchInitialData();
  
    queueSocket.on("connect", () => {
      console.log("Connected to queueing namespace");
    });
  
    queueSocket.emit("joinBranch", branchId);
    
    queueSocket.on("queueUpdate", (data) => {
      console.log('new data', data);
      setBarberList(data[branchId]?.barbers || []);
      setAppointments(data[branchId]?.appointments || []);
      setWalkInList(data[branchId]?.walkIns || []);
    });
  
    return () => {
      queueSocket.off("connect");
      queueSocket.off("queueUpdate");
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
    setTime(timeFormat(today));
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <main className="h-full w-full flex flex-col items-center">
        <div className="w-[90%] md:w-[95%] lg:w-[75%] flex justify-between items-center leading-3 bg-black/40 text-white p-4 my-2 md:my-4 shadow  shadow-white rounded">
          <div className="leading-0.2">
            <select className="text-s md:text-[20px] lg:text-[30px] tracking-tighter text-left my-2">
              <option value="">TOTO TUMBS STUDIO</option>
              <option value="">TOTO TUMBS HAGONOY</option>
            </select>
            <p className="text-xs md:text-[20px]">119 Ballecer South Signal Taguig City</p>
          </div>
          <h2 className="hidden md:block md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-center my-4">
            {date} {time}
          </h2>
        </div>

        <div className="w-[90%] md:w-[95%] lg:w-[75%] flex flex-col gap-y-2 md:flex-row gap-x-2 items-center justify-between leading-3 mb-4">
          <div className="w-full md:w-[50%] flex items-center text-white bg-black/40 shadow shadow-white gap-4 p-4">
            <MdCalendarToday className="text-[40px]"/>
        
            <div >
              <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter text-left my-2">
                Appointment
              </h1>
              <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-left">
                {appointments && appointments.filter(a => a.status === 'Booked' && a.scheduledTime === currentHour).length || 0}
              </p>
            </div>
          </div>

          <div className="w-full md:w-[50%] flex items-center text-white bg-black/40 shadow shadow-white gap-4 p-4">
            <MdDirectionsWalk className="text-[40px]" />
        
            <div>
              <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter text-left my-2">
                Walk-In
              </h1>
              <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-left">
                 {walkInList && walkInList.length || 0}  
              </p>
            </div>
          </div>                 
        </div>  

        <div className="w-full h-auto md:h-[60%] flex flex-col md:flex-row items-center justify-center gap-4 md:px-4">
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
                className="h-full w-[90%] md:w-[35%] lg:w-[25%] flex flex-col items-center justify-center rounded-lg bg-black/40 text-white shadow shadow-white p-4"
              >
                {barber?.imagePath ? (
                  <img
                    src={`${baseUrl}/${barber.imagePath}`}
                    alt={`${barber.fullName} profile`}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                ) : (
                  <FaUserCircle className="text-[80px] md:text-[120px mb-3" />
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
