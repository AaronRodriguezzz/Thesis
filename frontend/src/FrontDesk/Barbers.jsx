import React, { useEffect, useState } from "react";
import { get_data } from "../../services/GetMethod";
import { FaUserCircle } from 'react-icons/fa';
import { MdCalendarToday, MdDirectionsWalk } from "react-icons/md";
import { dateTimeFormat } from "../../utils/formatDate";
import { update_data } from '../../services/PutMethod';
import AssignCustomer from "../../components/modal/AssigningCustomer";
import NewWalkInCustomer from "../../components/modal/AddWalkInCustomer";
import ServiceCompleteModal from "../../components/modal/ServiceCompleteModal";
import { useAdminPageProtection } from "../../hooks/useUser";

const Appointments = () => {
    useAdminPageProtection();
    const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';
    const frontDesk = JSON.parse(localStorage.getItem('admin'));
    const today = new Date();
    const time = dateTimeFormat(today);

    const [barberList, setBarberList] = useState(null);
    const [appointmentsByHour, setAppointmentsByHour] = useState(null);
    const [walkInList, setWalkInList] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [barberToUpdate, setBarberToUpdate] = useState(null);
    const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const update_barberStatus = async (barber, newStatus) => {

        const updatedData = {...barber, status: newStatus }

        try{
            const response = await update_data('/update_employee', updatedData); 

            if (response.updatedInfo) {
                setBarberList(prevList =>
                    prevList.map(barber =>
                        barber._id === response.updatedInfo._id ? response.updatedInfo : barber
                    )       
                );
            }
        }catch(err){
                console.log(err);
        }
    }

    useEffect(() => {
        const getBarbersAndAppointments = async () => {
            try {
                const branchId = frontDesk?.branchAssigned;

                if(!branchId) return 
                
                setLoading(true);
                const [barberRes, appointmentRes, walkInRes] = await Promise.all([
                    get_data(`/barbers/${branchId}`),
                    get_data(`/appointments/${branchId}`),
                    get_data(`/walkIns/${branchId}`),
                ]);

                console.log(walkInRes);
                setBarberList(barberRes?.barbers || []);
                setAppointmentsByHour(appointmentRes?.appointments || []);
                setWalkInList(walkInRes || []);

                setLoading(false)

            } catch (err) {
                console.error("Failed to fetch barbers or appointments", err);
            }
        };

        getBarbersAndAppointments();
    }, []);

    if (loading) return <div>Loading...</div>;
    

    return (
        <div className="flex min-h-screen">
            <main className="flex flex-col justify-center items-center p-4 w-full">
                <div className="w-[90%] md:w-[95%] lg:w-[80%] flex justify-between items-center leading-3 bg-gray-800 text-white p-4 my-2 shadow rounded">
                    <div className="leading-0.5">
                        <h1 className="text-s md:text-[20px] lg:text-[30px] tracking-tighter text-left my-4">
                           TOTO TUMBS STUDIO
                        </h1>
                        <p className="text-xs md:text-[20px]">119 Ballecer South Signal Taguig City</p>
                        </div>
                        <h2 className="text-xs md:text-[20px]  lg:text-[30px] font-extralight tracking-tighter text-center my-4">
                            {today.toISOString().split("T")[0]} {time}
                        </h2>
                    </div>

                    <div className="w-[90%] md:w-[95%] lg:w-[80%] flex gap-x-2 items-center justify-between leading-3 mb-4">
                        <div className="w-[50%] flex items-center bg-white gap-8 p-4">
                            <MdCalendarToday className="text-[40px] text-gray-800" />

                            <div>
                                <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter text-left my-2">
                                    Appointment
                                </h1>
                                <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-left">
                                    {appointmentsByHour && appointmentsByHour.filter(a => a.status === 'Booked').length}
                                </p>
                            </div>
                        </div>

                        <div className="w-[50%] flex items-center justify-between bg-white gap-4 px-4 py-4">
                            <div className="flex">
                                <MdDirectionsWalk className="text-[50px] text-gray-800" />
                                <div>
                                    <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter text-left my-2">
                                        Walk-In
                                    </h1>
                                    <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-left">
                                        {walkInList && walkInList.length || 0}  
                                    </p>
                                </div>
                            </div>
                                
                            <button 
                                className="bg-black rounded-full py-2 px-4 text-white text-2xl font-semibold"
                                onClick={() => setIsAddingWalkIn(true)}
                            >
                                +
                            </button>
                        </div>
                            
                    </div>      

                    <div className="w-full h-full flex flex-row justify-center gap-8">
                        {barberList && barberList.map((barber,index) => (
                            <div key={index} className="relative w-[25%] h-[80%] flex flex-col items-center bg-white shadow-lg rounded-lg p-4">
                                {barber.imagePath ? (
                                        <img
                                            src={`${baseUrl}/${barber.imagePath}`}
                                            alt="Profile"
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (   
                                        <FaUserCircle className="text-[120px] text-black mb-2" />
                                    )
                                }

                                <h1 className="text-3xl font-semibold tracking-tight">{barber?.fullName}</h1>  
                                <p> 
                                    Current Status: 
                                    <span 
                                        style={{marginLeft: "3px", color: barber?.status === 'Available' || barber?.status === 'Barbering' ?  'green'
                                                : barber?.status === 'On-break' ? 'orange' : 'red' 
                                        }}
                                    >
                                        {barber?.status}
                                    </span>
                                </p>

                                <div className="w-full flex flex-col space-y-3 mt-4 px-8">
                                    <button 
                                        className="w-full bg-black hover:bg-green-400 text-white tracking-tight py-2 rounded-lg transition-colors ease-in-out"
                                        onClick={() => { 
                                            setIsAssigning(true); 
                                            setBarberToUpdate(barber);
                                        }}
                                        disabled={barber.status !== 'Available' || barber.status === 'On-break' || barber.status == 'Barbering' }
                                    >
                                        Assign Customer
                                    </button>
                                    <button 
                                        className="w-full bg-black hover:bg-green-400 text-white tracking-tight py-2 rounded-lg transition-colors ease-in-out"
                                        onClick={() => { 
                                            setIsCompleting(true);
                                            setBarberToUpdate(barber);
                                         }}
                                        disabled={barber?.status !== 'Barbering'}
                                    >
                                        Complete Barbering
                                    </button>
                                    <button 
                                        className="w-full bg-black hover:bg-orange-400 text-white tracking-tight py-2 rounded-lg transition-colors ease-in-out"
                                        disabled={barber?.status === 'Unavailable' || barber?.status === 'On-break' || barber.status == 'Barbering'}
                                        onClick={() => update_barberStatus(barber, 'On-break')} 
                                    >
                                        Break Time
                                    </button>
                                </div>
                                <button 
                                    className="absolute bottom-0 left-0 w-full text-white py-2 tracking-tight"
                                    style={{backgroundColor: barber?.status === 'Unavailable' || barber?.status === 'On-break' ? 'green' : 'red' }}
                                    disabled={barber?.status === 'Barbering'}
                                    onClick={() => update_barberStatus(barber, barber?.status === 'Unavailable' 
                                                                    || barber?.status === 'On-break' ? 'Available' : 'Unavailable' 
                                                                )}
                                >
                                    Set To { barber?.status === 'Unavailable' || barber?.status === 'On-break' ? 'Available' : 'Unavailable'}
                                </button>
          
                            </div>
                        ))}
                    </div>
                </main>
                
                {isAssigning && <AssignCustomer 
                    onCancel={setIsAssigning}
                    appointments={appointmentsByHour}
                    walkIn={walkInList}
                    setUpdatedAppointments={setAppointmentsByHour}
                    setUpdatedWalkIns={setWalkInList}
                    setUpdatedBarber={setBarberList}
                    barber={barberToUpdate}
                />}

                {isAddingWalkIn && <NewWalkInCustomer 
                    onCancel={setIsAddingWalkIn} 
                    setUpdatedData={setWalkInList}
                    barbers={barberList}
                />}

                {isCompleting && <ServiceCompleteModal 
                    onCancel={setIsCompleting}
                    barber={barberToUpdate}
                    setUpdatedAppointments={setAppointmentsByHour}
                    setUpdatedWalkIns={setWalkInList}
                    setUpdatedBarber={setBarberList}                
                />}
            </div>
        );
    };

    export default Appointments;