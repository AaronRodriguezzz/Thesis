import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { time } from '../../data/TimeData';
import { get_data } from '../../services/GetMethod'; 
import { post_data } from '../../services/PostMethod'; 
import { isFormValid } from '../../utils/objectValidation';

const AppointmentPage = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const today = new Date();
  const oneMonthAhead = new Date();
  oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

  const [branch, setBranches] = useState(null);
  const [services, setServices] = useState(null);
  const [appointments, setAppointments] = useState(null); 
  const [barbers, setBarbers] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer: user?._id,
    branch: '',
    barber: '',
    scheduledDate: '',
    scheduledTime: '',
    service: '',
    additionalService: '',
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handle_Submit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading

    const response = await post_data(formData, '/new_appointment');

    setLoading(false); // Hide loading after response

    if (response.appointment) {
      navigate('/queueing');
    }
  };

  useEffect(() => {
    if(branchId){
      setFormData({...formData, branch: branchId})
    }
  },[])

  useEffect(() => {
    const initializeData = async () => {
      const response = await get_data('/initialize_appointment_info');
      
      if (response) {
        setAppointments(response?.appointmentRecord);
        setServices(response?.services);
        setBranches(response?.branches);
        setBarbers(response?.barbers);
        console.log(response?.appointmentRecord);
      }
    };

    initializeData();
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-[url('/login.png')] bg-cover bg-center pt-10">

      <main className="flex gap-x-3 justify-center items-center my-2">

        <video
          src="/barbering.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="rounded-md w-[350px] h-auto"
        />

        <form className="flex flex-col p-4 w-1/3" onSubmit={handle_Submit}>
          <h1 className="text-3xl font-semibold tracking-tight my-6">
            APPOINTMENT FORM
          </h1>

          <label htmlFor="branch">Branch</label>
          <select
            id="branch"
            value={formData.branch}
            onChange={handleChange('branch')}
            className="border px-3 py-2 rounded mb-3"
          >
            <option value="">Select Branch</option>
            {branch &&
              branch.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
          </select>

          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="scheduledDate"
            min={today.toISOString().split('T')[0]}
            max={oneMonthAhead.toISOString().split('T')[0]}
            value={formData.scheduledDate}
            onChange={handleChange('scheduledDate')}
            className="border px-3 py-2 rounded mb-3"
          />

          <label htmlFor="barber">Service Barber</label>
          <select
            id="barber"
            value={formData.barber}
            onChange={handleChange('barber')}
            className="border px-3 py-2 rounded mb-3"
            disabled={!formData.branch}
          >
            <option value="">Select Barber</option>
            {barbers && formData?.branch &&
              barbers.map(
                (barber) => (
                  barber?.branchAssigned === formData.branch ? (
                    <option key={barber?._id} value={barber?._id}>
                      {barber?.fullName}
                    </option>
                  ) : (
                    null
                  )
                )
              )}
          </select>

          <label htmlFor="time">Time</label>
          <select
            id="scheduledTime"
            value={formData.scheduledTime}
            onChange={handleChange('scheduledTime')}
            className="border px-3 py-2 rounded mb-3"
            disabled={!formData.scheduledDate && !formData.barber}
          >
            <option value="">Select Time</option>
            {appointments ? (
              time.map((slot) => {
                const slotHour = slot.value;
                const currentHour = today.getHours();
                const isToday = new Date(formData.scheduledDate).toDateString() === today.toDateString();

                const matchingAppointment = appointments.find(
                  (a) => a.scheduledTime === slotHour 
                );

                const timeHasPassed = isToday && currentHour >= slotHour;
                const isAvailable = !matchingAppointment || matchingAppointment.count < 3;

                // Show if time hasn't passed and it's available
                if (!timeHasPassed && isAvailable) {
                  return (
                    <option key={slotHour} value={slotHour}>
                      {slot.timeTxt}    
                    </option>
                  );
                }

                return null;
              })
            ) : (
              time.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.timeTxt}
                </option>
              ))
            )}
          </select>

          <label htmlFor="serviceType">Service Type</label>
          <select
            id="service"
            value={formData.service}
            onChange={handleChange('service')}
            className="border px-3 py-2 rounded mb-3"
          >
            <option value="">Select Service</option>
            {services &&
              services.map(
                (service) =>
                  service.serviceType === 'Package Service' && (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  )
              )}
          </select>

          <label htmlFor="additionalService">Additional Service</label>
          <select
            id="additionalService"
            value={formData.additionalService}
            onChange={handleChange('additionalService')}
            className="border px-3 py-2 rounded mb-3"
          >
            <option value="">Select Extra Service (Optional)</option>
            {services &&
              services.map(
                (service) =>
                  service.serviceType === 'Additional Service' && (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  )
              )}
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`py-2 my-4 rounded-md text-white text-lg text-center ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'
            }`}
          >
            {loading ? 'Submitting...' : 'SUBMIT'}
          </button>
        </form>
      </main>

    </div>
  );
};

export default AppointmentPage;
