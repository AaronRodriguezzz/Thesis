import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navigation from  '../../components/NavBar';

export default function BarberStatusPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const barbers = [
    {
      name: "Aaron",
      available: true,
      status: "On-Going",
    },
    {
      name: "Alvin",
      available: true,
      status: "Available",  
    },
    {
      name: "Mark",
      available: true,
      status: "On-Going",
    },
  ];

  const formatTime = (date) => {
    const hours = date.getHours();
    const rawHours = hours % 12 || 12;
    const formattedHours = rawHours.toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
    setTime(formatTime(today));
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-gray-100 bg-[url('/login.png')] bg-cover bg-center">
      <Navigation otherPage={true} />

      <main className="h-full flex flex-col items-center">
        <div className="w-[75%] flex justify-between items-center leading-3 bg-white p-4 my-4 shadow rounded">
          <div>
            <h1 className="text-[20px] lg:text-[30px] tracking-tighter text-left lg:text-center my-4">
              TOTO TUMBS STUDIO BRANCH
            </h1>
            <p>119 Ballecer, City Of Manila, Metro Manila</p>
          </div>
          <h2 className="text-[30px] font-extralight tracking-tighter text-center my-4">
            {date} {time}
          </h2>
        </div>

        <div className="w-full h-[65%] flex flex-row items-center justify-center gap-x-4 px-4">
          {barbers.map((barber, index) => (
            <div
              className="h-full w-[25%] flex-col bg-white rounded-lg shadow-md"
              key={index}
            >
              <img
                src="/barber.jpg"
                alt={`${barber.name}`}
                width={150}
                height={150}
                className="rounded-full mx-auto my-2"
              />

              <div>
                <h1 className="text-[30px] font-semibold tracking-tight text-center">
                  {barber.name}
                </h1>
                <span
                  className={`block w-[80%] text-center text-sm font-medium px-2 py-1 mx-auto rounded-full 
                  ${
                    barber.status === "On-Going"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {barber.status}
                </span>
              </div>

              <div className="p-4">
                <h1 className="text-xl tracking-tighter font-semibold">
                  APPOINTMENTS LISTS
                </h1>
                <div className="flex justify-between text-lg px-2">
                  <h2>TIME</h2>
                  <h3>CUSTOMERS</h3>
                </div>

                <div className="h-[40%] min-h-[170px] overflow-y-auto custom-scrollbar">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-gray-300 py-2 px-4"
                    >
                      <h2>10:00 AM</h2>
                      <h3>{i + 1}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
