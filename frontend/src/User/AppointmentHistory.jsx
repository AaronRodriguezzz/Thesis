import React, { useState, useEffect } from "react";
import { get_data } from "../../services/GetMethod";
import { HistoryCard } from "../../components/UserHistoryCard";
import { useCustomerPageProtection } from '../../hooks/userProtectionHooks';
import CancellationModal from "../../components/modal/CancellationModal";
import { update_data } from '../../services/PutMethod';

const AppointmentHistory = () => {
  useCustomerPageProtection();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const statusOrder = {
    Booked: 1,
    Assigned : 2,
    Completed: 3,
    Cancelled: 4,
    "No-Show": 5,
  };

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

  
  const sortedAppointments = appointments && [...appointments].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  const handleCancellation = async (e, cancellationReason) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await update_data(`/appointment_cancellation/${appointmentToCancel}` , cancellationReason);

      if (response) {
        setShowCancellationModal(false);
        setAppointments(prev =>
          prev.map(s => (s._id === response.appointment._id ? response.appointment : s))
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(sortedAppointments);
  },[sortedAppointments])
  

  return (
    <>
      <div className="h-screen max-w-4xl mx-auto p-6 mt-10">
        <h1 className="font-extralight text-[50px] text-center my-5">Appointment History</h1>

        {sortedAppointments && sortedAppointments.map((appointment) => (
          <HistoryCard 
            key={appointment._id}
            id={appointment._id}
            service={appointment.service.name}
            date={appointment.scheduledDate.toString().split('T')[0]}
            status={appointment.status}
            onCancel={() => {
              setAppointmentToCancel(appointment._id);
              setShowCancellationModal(true);
            }}
          />
        ))}

        {showCancellationModal && <CancellationModal 
          onClose={() => setShowCancellationModal(false)}
          cancelling={loading}
          onProceed={handleCancellation}
        />}
      </div>
    </>
    
  );
};


export default AppointmentHistory;
