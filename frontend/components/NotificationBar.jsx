import React, { useState, useEffect } from 'react'
import { appointmentTimeFormat } from '../utils/formatDate'
import { notificationsSocket } from '../services/SocketMethods';

const NotificationBar = ({isOpen, setNewCount, appointments}) => {

    const [newNotifications, setNotifications] = useState([]);

    useEffect(() => {
        // When we connect
        notificationsSocket.on("connect", () => {
            console.log("Connected to notifications namespace");
        });

        // Listen for new appointments
        notificationsSocket.on("newAppointment", (data) => {
            console.log("New appointment:", data);
            setNotifications(prev => [data, ...prev]);
            setNewCount(prev => prev + 1);
        });

        // Cleanup
        return () => {
            notificationsSocket.off("newAppointment");
            notificationsSocket.off("connect");
        };
    }, []);

    if(!isOpen) return 

    return (
        <div className='fixed top-20 right-18 h-[400px] w-[250px] bg-gray-800 p-4 shadow-lg rounded z-30'>
            <h1 className='font-semibold text-2xl text-white tracking-tighter mb-4'>Notifications</h1>

            <div className='max-h-[330px] overflow-y-auto custom-scrollbar p-2'>

                {appointments && appointments.filter(a => a.status === 'Booked').map(appointment => (
                    <div className='flex justify-between text-white text-sm mb-2'>
                        <div>
                            <h2 className='text-md font-semibold text-green-400'>{appointment.customer.firstName}</h2>
                            <p>{appointment.customer.email}</p>
                            <p>{appointment.customer.phone}</p>
                        </div>

                        <div>
                            <p>{appointment.scheduledDate.split('T')[0]}</p>
                            <p>{appointmentTimeFormat(appointment.scheduledTime)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NotificationBar