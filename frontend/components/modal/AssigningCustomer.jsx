import React, { useEffect, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';
import { post_data } from '../../services/PostMethod';
import { appointmentTimeFormat } from '../../utils/formatDate';

const AssignCustomer = ({  
        onCancel, 
        appointments, 
        walkIn, 
        setUpdatedAppointments, 
        setUpdatedWalkIns, 
        setUpdatedBarber,
        barber
    }) => {

    const [selectedCategory, setSelectedCategory] = useState('Appointment');
    
    const customerSelected = async (customer) => {
        try{
            const response = await update_data(`/assign_customer/${selectedCategory}`, {
                id: customer._id,
                barberId: barber._id
            });

            if(response) {

                selectedCategory === 'Appointments' ? 
                setUpdatedAppointments(prev => prev.map(a => 
                    a._id === customer._id ? { ...a, barber: barber._id, status: 'Assigned' } : a
                )) 

                :

                setUpdatedWalkIns(prev => prev.map(a => 
                    a._id === customer._id ? { ...a, barber: barber._id, status: 'Assigned' } : a
                )) 

                setUpdatedBarber(prev => prev.map(a => a._id === barber._id ? { ...a, status: 'Barbering' } : a));
                
                onCancel(false);
            }

        }catch(err) {
            console.error('Error selecting customer:', err);
        }
    };

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <div className='w-[50%] max-w-[600px] bg-white rounded-lg shadow-md p-5 shadow-gray-200'>
                <div className='flex gap-x-4 mt-2'>
                    <button 
                        className='w-[50%] text-2xl font-semibold tracking-tighter py-2' 
                        style={{borderBottom: selectedCategory === 'Appointment' ? '3px solid black' : ''}}
                        onClick={(e) => setSelectedCategory(e.target.textContent)}
                    >
                        Appointment
                    </button>
                    <button 
                        className='w-[50%] text-2xl font-semibold tracking-tighter py-2' 
                        style={{borderBottom: selectedCategory === 'Walk-In' ? '3px solid black' : ''}}
                        onClick={(e) => setSelectedCategory(e.target.textContent)}
                    >
                        Walk-In
                    </button>
                </div>

                <div className='min-h-[400px] flex flex-col overflow-y-auto'> 
                    {selectedCategory === 'Appointment' ? (
                        <div>
                            <div className='min-h-[380px] flex flex-col justify-start '>
                                {appointments && appointments.length > 0 ? (
                                    appointments.filter(a => a.status === 'Booked').map((appointment) => (
                        
                                        <div key={appointment?._id} className='flex items-center bg-black text-white p-4 mt-2 rounded-l-lg' onClick={() => customerSelected(appointment)}>
                                            <div className='flex-1 flex-col tracking-tight text-sm'>
                                                <h1 className='w-full flex justify-between text-lg font-semibold'>
                                                    <span>{appointment.customer?.firstName} {appointment.customer?.lastName}</span>
                                                    <span>{appointment?.scheduledDate.toString().split('T')[0]} {appointmentTimeFormat(appointment?.scheduledTime)}</span>
                                                </h1>
                                                <p>Service: {appointment.service?.name} (P{appointment.service?.price})</p>
                                                <p>Additional: {appointment.additionalService?.name || 'N/A' } (P{appointment.additionalService?.price || ' '})</p>
                                                <p>Barber: {appointment.barber?.fullName || 'N/A'}</p>
                                                <p>Code: {appointment.uniqueCode}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-center text-gray-500 my-auto'>No appointments available</div>
                                )}
                                 
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className='min-h-[380px] flex flex-col justify-start overflow-y-auto'>
                                {walkIn && walkIn.length > 0 ? (
                                    walkIn.filter(a => a.status !== 'Assigned').map((walkIn, index) => (
                        
                                        <div key={index} className='flex items-center bg-black text-white p-4 mt-2 rounded-l-lg' onClick={() => customerSelected(walkIn)}>
                                            <div className='flex-1 flex-col tracking-tight text-sm'>
                                                <h1 className='w-full flex justify-between text-lg font-semibold'>
                                                    {walkIn.customerName || 'N/A'}
                                                </h1>
                                                <p>Service: {walkIn.service?.name} (P{walkIn.service?.price})</p>
                                                <p>
                                                    Additional: {walkIn?.additionalService?.name || 'N/A'} 
                                                    {walkIn.additionalService ? `(P${walkIn.additionalService?.price})` : ''}
                                                </p>
                                                <p>Total Payment: {walkIn.totalAmount}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-center text-gray-500 my-auto '>No walk-in/s available</div>
                                )}
                                 
                            </div>
                        </div>
                    )}

                    <button className='w-[100px] mt-2 bg-red-600 text-white' onClick={() => onCancel(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AssignCustomer;