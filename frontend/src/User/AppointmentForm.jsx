import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/NavBar'; // adjust if your folder is different
import Footer from '../../components/Footer';
import { time } from '../../data/TimeData';
import { get_data } from '../../services/GetMethod'; // adjust based on actual location

const AppointmentPage = () => {
  const today = new Date();
  const oneMonthAhead = new Date();
  oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

  const [branch, setBranches] = useState(null);
  const [services, setServices] = useState(null);
  const [appointments, setAppointments] = useState(null);

  const [formData, setFormData] = useState({
    branch: '',
    date: '',
    time: '',
    serviceType: '',
    additionalService: '',
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  useEffect(() => {
    const initializeData = async () => {
      const response = await get_data('/initialize_appointment_info');
      if (response) {
        setAppointments(response?.appointmentRecord);
        setServices(response?.services);
        setBranches(response?.branches);
      }
    };

    initializeData();
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-[url('/login.png')] bg-cover bg-center">
      <Navigation otherPage={true} />

      <main className="flex gap-x-3 p-5 justify-center items-center">
        <div>
          <video
            src="/barbering.mp4"
            width="350"
            autoPlay
            loop
            muted
            playsInline
            className="rounded-lg shadow-lg shadow-gray-800"
          />
        </div>

        <form className="flex flex-col gap-4 p-4 w-1/3">
          <h1 className="text-3xl font-semibold tracking-tight my-6">
            APPOINTMENT FORM
          </h1>

          <label htmlFor="branch">Branch</label>
          <select
            id="branch"
            value={formData.branch}
            onChange={handleChange('branch')}
            className="border px-3 py-2 rounded"
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
            id="date"
            min={today.toISOString().split('T')[0]}
            max={oneMonthAhead.toISOString().split('T')[0]}
            value={formData.date}
            onChange={handleChange('date')}
            className="border px-3 py-2 rounded"
          />

          <label htmlFor="time">Time</label>
          <select
            id="time"
            value={formData.time}
            onChange={handleChange('time')}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Time</option>
            {appointments &&
              time.map((slot) => {
                const currentHour = today.getHours();
                const matchingAppointment = appointments.find(
                  (a) => a.hour === slot.value
                );

                const timeHasPast = currentHour < slot.value;
                const isAvailable =
                  !matchingAppointment || matchingAppointment?.count < 3;

                return timeHasPast && isAvailable ? (
                  <option key={slot.value} value={slot.value}>
                    {slot.time}
                  </option>
                ) : null;
              })}
          </select>

          <label htmlFor="serviceType">Service Type</label>
          <select
            id="serviceType"
            value={formData.serviceType}
            onChange={handleChange('serviceType')}
            className="border px-3 py-2 rounded"
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
            className="border px-3 py-2 rounded"
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

          <Link
            to="/queueing"
            className="bg-green-500 py-2 my-4 rounded-md text-white text-lg text-center"
          >
            SUBMIT
          </Link>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentPage;
