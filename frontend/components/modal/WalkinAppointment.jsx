import React, { useState, useEffect } from 'react';
import { get_data } from '../../services/GetMethod';
import { post_data } from '../../services/PostMethod';
import { time } from '../../data/TimeData';

const ThreeLayerModal = ({ onClose, setNewData }) => {
    const today = new Date();
    const oneMonthAhead = new Date();
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    const [step, setStep] = useState(1);
    const [hasAccount, setHasAccount] = useState(null);
    const [existingUserInput, setExistingUserInput] = useState('');
    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    });
    const [formData, setAppointmentData] = useState({
        customer: '',
        branch: '',
        scheduledDate: '',
        scheduledTime: '',
        service: '',
        additionalService: '',
    });

    const [branch, setBranches] = useState(null);
    const [services, setServices] = useState(null);
    const [appointments, setAppointments] = useState(null); 
    const [loading, setLoading] = useState(false);
    
    const handleNext = () => {
        if (step === 1 && hasAccount !== null) {
            setStep(2);
        } else if (step === 2 && hasAccount) {
            // TODO: Search by email/name logic
            setStep(3);
        } else if (step === 2 && !hasAccount) {
            // TODO: Register logic (post_data)
            setStep(3);
        }
    };

    const handleChange = (field, form) => (e) => {
        if(form === 'registration') {
            setCustomerData({ ...customerData, [field]: e.target.value });
        }else{
            setAppointmentData({ ...formData, [field]: e.target.value });
        }
    };

    const resetModal = () => {
        setStep(1);
        setHasAccount(null);
        setCustomerData({});
    };


    const handle_registration = async (e) => {
        e.preventDefault();
        
        const response = await post_data(customerData, "/user_registration");
        
        if (response) {
            setAppointmentData({ ...formData, customer: response?.user?._id});
            setHasAccount(true)
            handleNext();
        }
    } 

    const handle_submit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading

        const response = await post_data(formData, '/new_appointment');

        setLoading(false); 

        if (response.appointment) {
            setNewData(prev => [...prev, response?.appointment]);
            onClose(false); 
            window.location.reload(); // <- This will reload the whole page

        }
    }

    const find_Customer = async (e) => {
        e.preventDefault();
        
        if(!existingUserInput) return alert('Fill the input field first');

        const response = await get_data(`/get_customer/${existingUserInput}`);
        
        if (response) {
            setAppointmentData({ ...formData, customer: response?.user?._id});
            setHasAccount(true)
            handleNext();
        }
    }


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
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                {/* Step 1: Ask if they have an account */}
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Existing Customer?</h2>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => {
                                setHasAccount(true);
                                setStep(2);
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Yes, look up by email/name
                            </button>
                            <button
                                onClick={() => {
                                setHasAccount(false);
                                setStep(2);
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                No, register new customer
                            </button>

                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => onClose(false)}>Cancel</button>
                        </div>
                    </>
                )}

                {/* Step 2a: Lookup existing */}
                {step === 2 && hasAccount && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Find Customer</h2>
                        <input
                            type="text"
                            value={existingUserInput}
                            onChange={(e) => setExistingUserInput(e.target.value)}
                            placeholder="Enter email or name"
                            className="w-full border px-3 py-2 rounded mb-4"
                        />
                        <button
                            onClick={find_Customer}
                            className="bg-green-500 text-white w-full py-2 rounded"
                        >
                            Search & Proceed
                        </button>
                    </>
                )}

                {/* Step 2b: Register new */}
                {step === 2 && !hasAccount && (
                <>
                    <h2 className="text-2xl font-semibold my-4 tracking-tight">Register New Customer</h2>
                    <form className="flex flex-col gap-3" onSubmit={handle_registration}>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={customerData.firstName}
                            onChange={handleChange('firstName', 'registration')}
                            className="border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={customerData.lastName}
                            onChange={handleChange('lastName', 'registration')}
                            className="border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={customerData.email}
                            onChange={handleChange('email', 'registration')}
                            className="border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={customerData.phone}
                            onChange={handleChange('phone', 'registration')}
                            className="border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={customerData.password}
                            onChange={handleChange('password', 'registration')}
                            className="border px-3 py-2 rounded"
                            required
                        />
                        <button
                            type='submit'
                            className="bg-green-600 text-white py-2 rounded mt-4"
                        >
                            Register & Proceed
                        </button>
                    </form>
                </>
                )}

                {/* Step 3: Show Appointment Form */}
                {step === 3 && (
                    <>
                        <main className="flex gap-x-3 justify-center items-center my-2">     
                            <form className="w-full flex flex-col p-4" onSubmit={handle_submit}>
                                <h1 className="text-3xl font-semibold tracking-tight my-6">
                                    APPOINTMENT FORM
                                </h1>
                        
                                <label htmlFor="branch">Branch</label>
                                <select
                                    id="branch"
                                    value={formData.branch}
                                    onChange={handleChange('branch', 'appointment')}
                                    className="border px-3 py-2 rounded mb-3"
                                  >
                                    <option value="">Select Branch</option>
                                    {branch &&
                                        branch.map((b) => (
                                            <option key={b._id} value={b._id}>
                                                {b.name}
                                            </option>
                                        ))
                                    }
                                </select>
                        
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    id="scheduledDate"
                                    min={today.toISOString().split('T')[0]}
                                    max={oneMonthAhead.toISOString().split('T')[0]}
                                    value={formData.scheduledDate}
                                    onChange={handleChange('scheduledDate', 'appointment')}
                                    className="border px-3 py-2 rounded mb-3"
                                />
                        
                                <label htmlFor="time">Time</label>
                                <select
                                    id="scheduledTime"
                                    value={formData.scheduledTime}
                                    disabled={!formData.scheduledDate}
                                    onChange={handleChange('scheduledTime', 'appointment')}
                                    className="border px-3 py-2 rounded mb-3"
                                >
                                    <option value="" disabled>
                                        Select Time
                                    </option>
                                    {appointments && formData.scheduledDate &&
                                        time.map((slot) => {
                                            const currentDate = new Date();
                                            const selectedDate = new Date(formData.scheduledDate);
                                            
                                            const isToday = currentDate.toDateString() === selectedDate.toDateString();

                                            const slotAppointments = appointments.filter(
                                                (a) => 
                                                    a.scheduledTime === slot.value &&
                                                    new Date(a.scheduledDate).toDateString() === selectedDate.toDateString()
                                            );

                                            const isAvailable =  slotAppointments.length < 3;

                                            const isFutureTime = !isToday || currentDate.getHours() < slot.value;

                                            if (isAvailable && isFutureTime) {
                                                return (
                                                    <option key={slot.value} value={slot.value}>
                                                        {slot.timeTxt}
                                                    </option>
                                                );
                                            }
                                            return null;
                                        })}
                                </select>
                        
                                <label htmlFor="serviceType">Service Type</label>
                                <select
                                    id="service"
                                    value={formData.service}
                                    onChange={handleChange('service', 'appointment')}
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
                                        )
                                    }
                                </select>
                        
                                <label htmlFor="additionalService">Additional Service</label>
                                <select
                                    id="additionalService"
                                    value={formData.additionalService}
                                    onChange={handleChange('additionalService', 'appointment')}
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

                        <button onClick={resetModal} className="text-sm text-blue-500 mt-4">
                            Start Over
                        </button>
                    </>
                )}
            </div>
        </div>
    )
};

export default ThreeLayerModal;
