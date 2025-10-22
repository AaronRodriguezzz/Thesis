import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { time } from '../../data/TimeData';
import { get_data } from '../../services/GetMethod'; 
import { post_data } from '../../services/PostMethod';
import { motion } from 'framer-motion';
import { AnimatedDropDown } from '../../components/animations/DropDownAnimaton';
import { CustomAlert } from '../../components/modal/CustomAlert';
import { useCustomerPageProtection, useUserProtection, useUser } from '../../hooks/userProtectionHooks';
import { notificationsSocket } from '../../services/SocketMethods';
import TermsModal from '../../components/modal/TermsAndConditionModal';

const AppointmentPage = () => {
  useCustomerPageProtection();

  const { branchId } = useParams();
  const navigate = useNavigate();

  const user = useUser();
  const today = new Date();
  const oneMonthAhead = new Date();
  oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

  const [branch, setBranches] = useState(null);
  const [services, setServices] = useState(null);
  const [appointments, setAppointments] = useState(null); 
  const [barbers, setBarbers] = useState(null);
  const [termsChecked, setTermsChecked] = useState(false);
  const [viewTerms, setViewTerms] = useState(false)
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer: user?._id,
    branch: '',
    barber: '',
    scheduledDate: '',
    scheduledTime: '',
    service: '',
    additionalService: '',
    totalAmount: 0,
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handle_Submit = async (e) => {
    e.preventDefault();

    if(!termsChecked) return

    if(today.getHours() >= 21 &&  formData.scheduledDate === today.toISOString().split('T')[0]){
      CustomAlert('error', "You can't book an appointment after 9 PM today.");
      return;
    } 

    try{
      setLoading(true);

      const response = await post_data(formData, '/new_appointment');

      if (response) {
        navigate('/queueing');
      }

      setLoading(false);
    }catch(err){
      console.log(err);
    }

  };

  useEffect(() => {
        // When we connect
        notificationsSocket.on("connect", () => {
            console.log("Connected to notifications namespace");
        });

        // Listen for new appointments
        notificationsSocket.on("newAppointment", (data) => {
            setNotifications(prev => [data, ...prev]);
            setNewCount(prev => prev + 1);
        });

        // Cleanup
        return () => {
            notificationsSocket.off("newAppointment");
            notificationsSocket.off("connection");
        };
  }, []);

  useEffect(() => {
    if (formData.service || formData.additionalService) {
      const service = services.find(s => s._id === formData?.service) || { price: 0 };
      const additionalService = services.find(s => s._id === formData?.additionalService) || { price: 0 };

      setFormData(prev => ({
        ...prev,
        totalAmount: service.price + additionalService.price
      }));
    }
  }, [formData.service, formData.additionalService, services]);

  useEffect(() => {
    if(branchId){
      setFormData(prev => ({
        ...prev,
        branch: branchId
      }));
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
      }
    };

    initializeData();
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden pt-10">

      <main className="flex gap-x-3 justify-center items-center my-2 text-white">

        <motion.video
          initial={{ opacity: 0}}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          src="/barbering.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block rounded-md w-[350px] h-auto"
        />

        <form className="flex flex-col p-4 w-full md:w-1/3" onSubmit={handle_Submit}>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}  
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-3xl font-semibold tracking-tight my-6"
          >
            APPOINTMENT FORM
          </motion.h1>

          <AnimatedDropDown
            label="Select Branch"
            id="branch" 
            delay={0.3}
            value={formData.branch}
            onChange={handleChange('branch')}
            className="bg-black/90 border px-3 py-2 rounded mb-3"
            disabled={!branch}
          >
            <option value="" className='hidden'>Select Branch</option>
            {branch &&
              branch.map((b) => (
                <>
                  <optgroup label={b.address} />
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                </>
              
              ))
            }
          </AnimatedDropDown>

          <motion.label 
            htmlFor="date"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
          >
            Date
          </motion.label>
          <motion.input
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5,  ease: "easeInOut", delay: 0.5 }}
            type="date"
            id="scheduledDate"
            min={today.toISOString().split('T')[0]}
            max={oneMonthAhead.toISOString().split('T')[0]}
            value={formData.scheduledDate}
            onChange={handleChange('scheduledDate')}
            className="border px-3 py-2 rounded mb-3"
          />

          <AnimatedDropDown
            label="Barber Selection"
            id="barber"
            delay={0.7}
            value={formData.barber}
            onChange={handleChange('barber')}
            className="bg-black/90 border px-3 py-2 rounded mb-3 disabled:border-white/40"
            disabled={!formData.branch}
          >   
            <option value="" disabled>Select Barber (Optional)</option>
            {barbers && formData?.branch &&
              barbers.map(
                (barber) => (
                  barber?.branchAssigned === formData.branch ? (
                    <option key={barber?._id} value={barber?._id} disabled={barber?.status === 'On Leave'}>
                      {barber?.fullName} {barber?.status === 'On Leave' ? '(On Leave)' : ''}
                    </option> 
                  ) : (
                    null
                  )
                )
              )
            }
          </AnimatedDropDown>


          <AnimatedDropDown
            label="Time"
            id="scheduledTime"
            delay={0.9}
            value={formData.scheduledTime}
            onChange={handleChange('scheduledTime')}
            className="bg-black/90 border px-3 py-2 rounded mb-3 disabled:border-white/40"
            disabled={!formData.scheduledDate && !formData.barber}
          >
            <option value="" disabled>Select Time</option>
            {appointments ? (
              time.map((slot) => {
                const slotHour = slot.value;
                const currentHour = today.getHours();
                const isToday = new Date(formData.scheduledDate).toDateString() === today.toDateString();


                const matchingAppointment = appointments.filter((a) =>
                  a.branch === formData?.branch &&
                  a.scheduledTime === slotHour &&
                  new Date(a.scheduledDate).toDateString() === new Date(formData?.scheduledDate).toDateString()
                );                

                const barberUnavailable = formData.barber ? matchingAppointment.some((a) => a.barber === formData.barber) : false;
                const barberAvailable = !barberUnavailable;
                const timeHasPassedToday = isToday && currentHour >= slotHour;  
                const isAvailable = matchingAppointment.length < 3;

                // console.log(isAvailable, matchingAppointment.length, slot.value);    

                if (!timeHasPassedToday && isAvailable && barberAvailable) {
                  return (
                    <option key={slotHour} value={slotHour}>
                      {slot.timeTxt}
                    </option>
                  );
                } else if (!isToday && isAvailable && barberAvailable) {
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
          </AnimatedDropDown>

          <AnimatedDropDown
            label="Service Type"
            id="service"
            delay={1.1}
            value={formData.service}
            onChange={handleChange('service')}
            className="bg-black/90 border px-3 py-2 rounded mb-3"
          >
            <option value="" disabled>Select Service</option>
            {services &&
              services.map(
                (service) =>
                  service.serviceType === 'Package Service' && (
                    <>
                      <optgroup label={service.description} className='text-sm font-semibold' />
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    </>
                    
                )
            )}
          </AnimatedDropDown>

          <AnimatedDropDown
            label="Additional Service"
            id="additionalService"
            delay={1.3}
            value={formData.additionalService}
            onChange={handleChange('additionalService')}
            className="bg-black/90 border px-3 py-2 rounded mb-3"
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
          </AnimatedDropDown>

          <div className='flex gap-x-2 items-center'>
            <motion.input
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
              type="checkbox"
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              className="w-5 h-5 accent-green-500 rounded"
            />
            <span 
              className='space-x-1'
            >
              <motion.span
                onClick={() => setViewTerms(true)}
                initial={{ opacity: 0, x: 200}}
                animate={{ opacity: 1, x: 0  }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
              >
                I agree to the
              </motion.span>
              <motion.a 
                initial={{ opacity: 0, x: 200  }}
                animate={{ opacity: 1, x: 0  }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
                onClick={() => setViewTerms(true)} 
                className='text-blue-500 hover:underline hover:cursor-pointer'
              >
                Terms And Conditions
              </motion.a>

            </span>
          </div>
          
          <motion.button
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
            type="submit"
            disabled={loading || !termsChecked}
            className={`py-2 my-4 rounded-md bg-white text-black text-lg text-center disabled:cursor-not-allowed disabled:bg-white/80 ${
              loading ? 'bg-white/80 cursor-not-allowed' : 'bg-white'
            }`}
          >
            {loading ? 'Submitting...' : 'SUBMIT'}
          </motion.button>
        </form>
      </main>

      <TermsModal 
        isOpen={viewTerms} 
        onClose={() => setViewTerms(false)} 
        onAccept={() => {
          setTermsChecked(true);
          setViewTerms(false);
        }} 
      />
    </div>
  );
};

export default AppointmentPage;
