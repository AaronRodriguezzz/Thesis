import { useEffect, useState } from "react";
import { MdCalendarToday, MdDirectionsWalk } from "react-icons/md";
import { useQueueData } from "../../hooks/useQueueData";
import { FaUserCircle } from 'react-icons/fa';
import { timeFormat } from "../../utils/formatDate";
import { useFetch } from '../../hooks/useFetch'
import AssignmentLoading from '../../components/animations/AssignmentLoading';

export default function BarberStatusPage() {
  const today = new Date();
  
  const [currentHour, setCurrentHour] = useState(0);
  const [currentBranch, setCurrentBranch] = useState("");

  const { barberList, appointments, walkIns } = useQueueData(currentBranch);
  const { data, loading, error } = useFetch('/get_data/branch', null, null, []);

  // Set default branch when data loads
  useEffect(() => {
    if (data && data.length > 0 && !currentBranch) {
      setCurrentBranch(data[0]._id);
    }
  }, [data]);

  // Update every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const hourNow = new Date().getHours();
      if (hourNow !== currentHour) setCurrentHour(hourNow);
    }, 5 * 60 * 1000);
  
    return () => clearInterval(interval); 
  }, [currentHour]);


  if (loading) return <AssignmentLoading />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );

  const selectedBranch = data?.find(b => b._id === currentBranch);

  return (
    <div id="Queueing" className="w-screen h-screen overflow-x-hidden">
      <main className="h-full w-full flex flex-col items-center">

        {/* Branch Header */}
        <div className="w-[90%] md:w-[95%] lg:w-[75%] flex justify-between items-center bg-black/40 text-white p-4 my-2 md:my-4 shadow shadow-white rounded">
          <div>
            <select
              value={currentBranch}
              onChange={(e) => setCurrentBranch(e.target.value)}
              className="text-s md:text-[20px] lg:text-[30px] bg-black/40 tracking-tighter my-2"
            >
              {data?.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>

            {/* Address */}
            <p className="text-xs md:text-[20px] tracking-tight">
              {selectedBranch?.address || "Loading address..."}
            </p>
          </div>

          {/* Date and Time */}
          <h2 className="hidden md:block md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-center my-4">
            {today.toISOString().split("T")[0]} {timeFormat(today)}
          </h2>
        </div>

        {/* Appointment & Walk-in Count */}
        <div className="w-[90%] md:w-[95%] lg:w-[75%] flex flex-col md:flex-row gap-y-2 gap-x-2 items-center justify-between mb-4">

          {/* Appointments */}
          <div className="w-full md:w-[50%] flex items-center text-white bg-black/40 shadow shadow-white gap-4 p-4">
            <MdCalendarToday className="text-[40px]" />
            <div>
              <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter">Appointment</h1>
              <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight">
                {appointments?.filter(a => a.status === 'Booked' && a.scheduledTime === currentHour).length || 0}
              </p>
            </div>
          </div>

          {/* Walk-Ins */}
          <div className="w-full md:w-[50%] flex items-center text-white bg-black/40 shadow shadow-white gap-4 p-4">
            <MdDirectionsWalk className="text-[40px]" />
            <div>
              <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter">Walk-In</h1>
              <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight">
                {walkIns?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Barber Boxes OR Branch Closed */}
        <div className="w-full h-auto md:h-[60%] flex flex-col md:flex-row items-center justify-center gap-4 md:px-4">

          {selectedBranch?.status === "Close" ? (
            <div className="text-center">
              <h3 className="text-white text-5xl bg-white/10 py-5 px-6 rounded-full tracking-tighter">
                Sorry, we're closed
              </h3>
              <p className="text-white mt-2 text-lg tracking-tight">
                Refresh after a few minutes to check branch availability.
              </p>
            </div>
          ) : (
            <>
              {barberList?.map((barber, index) => {
                let statusColor = "text-red-600";
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
                    <FaUserCircle className="text-[80px] md:text-[120px] mb-3" />

                    <h1 className="text-[30px] font-semibold tracking-tight text-center">
                      {barber.fullName}
                    </h1>

                    <span
                      className={`block w-[80%] text-center text-lg font-medium px-2 py-1 mt-2 rounded-full ${statusColor}`}
                    >
                      {barber.status}
                    </span>
                  </div>
                );
              })}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
