import React, { useState } from "react";
import { HistoryCard } from "../../components/UserHistoryCard";
import { useCustomerPageProtection } from '../../hooks/userProtectionHooks';
import { update_data } from '../../services/PutMethod';
import { useFetch } from "../../hooks/useFetch";
import CancellationModal from "../../components/modal/CancellationModal";

const AppointmentHistory = () => {
  useCustomerPageProtection();

  const { data, loading, error, setData } = useFetch('/get_data/appointments', null, null, []);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const statusOrder = {
    Booked: 1,
    Assigned : 2,
    Completed: 3,
    Cancelled: 4,
    "No-Show": 5,
  };
  
  const sortedAppointments = data && [...data].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  const handleCancellation = async (e, cancellationReason) => {
    e.preventDefault();

    try {
      const response = await update_data(`/appointment_cancellation/${appointmentToCancel}` , cancellationReason);

      if (response) {
        setShowCancellationModal(false);
        setData(prev =>
          prev.map(s => (s._id === response.appointment._id ? response.appointment : s))
        );
      }
    } catch (err) {
      console.log(err);
    } 
  };
  
  return (
    <>
      <div className="h-screen max-w-4xl mx-auto p-6 mt-5">
        <h1 className="font-extralight text-[25px] md:text-[50px] text-center my-5">Appointment History</h1>

        <div className="max-h-[600px] overflow-auto custom-scrollbar">
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
        </div>
        

        {showCancellationModal && 
          <CancellationModal 
            onClose={() => setShowCancellationModal(false)}
            cancelling={loading}
            onProceed={handleCancellation}
          />
        }
      </div>
    </>
    
  );
};


export default AppointmentHistory;
