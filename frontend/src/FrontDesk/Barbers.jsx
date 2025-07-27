import React, { useEffect, useState } from "react";
import { get_data } from "../../services/GetMethod";
import { FaUserCircle } from 'react-icons/fa';
import { MdCalendarToday, MdDirectionsWalk } from "react-icons/md";
import { dateTimeFormat } from "../../utils/formatDate";
import { update_data } from '../../services/PutMethod';
import AssignCustomer from "../../components/modal/AssigningCustomer";
import NewWalkInCustomer from "../../components/modal/AddWalkInCustomer";

const Appointments = () => {
    const frontDesk = JSON.parse(localStorage.getItem('admin'));
    const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';
    const today = new Date();
    const time = dateTimeFormat(today);

    const [barberList, setBarberList] = useState(null);
    const [appointmentsByHour, setAppointmentsByHour] = useState(null);
    const [walkInList, setWalkInList] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState('');

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

                const [barberData, appointmentData] = await Promise.all([
                    get_data(`/barbers/${branchId}`),
                    get_data(`/appointments/${branchId}`),
                ]);

                if (barberData?.barbers) {
                    setBarberList(barberData.barbers);
                }

                if (appointmentData?.appointments) {
                    setAppointmentsByHour(appointmentData.appointments);
                }
            } catch (err) {
                console.error("Failed to fetch barbers or appointments", err);
            }
        };

        getBarbersAndAppointments();
    }, []);

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
                                    {appointmentsByHour && appointmentsByHour.length}
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
                                        3  
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
                        {barberList && barberList.map((barber) => (
                            <div className="relative w-[25%] h-[80%] flex flex-col items-center bg-white shadow-lg rounded-lg p-4">
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
                                        onClick={() => setIsAssigning(true)}
                                        disabled={barber.status !== 'Available'}
                                    >
                                        Assign Customer
                                    </button>
                                    <button 
                                        className="w-full bg-black hover:bg-green-400 text-white tracking-tight py-2 rounded-lg transition-colors ease-in-out"
                                        disabled={barber?.status !== 'Barbering'}
                                    >
                                        Complete Barbering
                                    </button>
                                    <button 
                                        className="w-full bg-black hover:bg-orange-400 text-white tracking-tight py-2 rounded-lg transition-colors ease-in-out"
                                        disabled={barber?.status === 'Unavailable' || barber?.status === 'On-break' }
                                        onClick={() => update_barberStatus(barber, 'On-break')} 
                                    >
                                        Break Time
                                    </button>
                                </div>
                                <button 
                                    className="absolute bottom-0 left-0 w-full text-white py-2 tracking-tight"
                                    style={{backgroundColor: barber?.status === 'Unavailable' || barber?.status === 'On-break' ? 'green' : 'red' }}
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
                    setSelectedCustomer={setSelectedCustomer}
                />}

                {isAddingWalkIn && <NewWalkInCustomer 
                    onCancel={setIsAddingWalkIn} 
                    setUpdatedData={setWalkInList}
                    barbers={barberList}
                />}
            </div>
        );
    };

    export default Appointments;