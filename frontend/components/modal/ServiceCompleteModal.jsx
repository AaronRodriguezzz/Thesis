import React from 'react';
import { FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa'; // cash and mobile icons
import { update_data } from '../../services/PutMethod';
import { useUser } from '../../hooks/userProtectionHooks';

const ServiceCompleteModal = ({ 
        onCancel, 
        barber,   
        setUpdatedAppointments, 
        setUpdatedWalkIns, 
        setUpdatedBarber
    }) => {

    const user = useUser();

    const handleComplete = async (paymentMethod) => {
        console.log(barber)
        try{
            const response = await update_data(`/complete_assignment/${barber.customerTypeAssigned}`, {
                paymentMethod,
                barberId: barber._id,
                recordedBy: user?._id
            });
    
            if(response.updatedInfo) {
                // setUpdatedData(prev => prev.filter(a => a._id !== response.updatedInfo._id));

                barber.customerTypeAssigned === 'Appointments' ? 

                setUpdatedAppointments(prev => prev.map(a => 
                    a._id === response.updatedInfo._id ? { ...a, status: 'Completed' } : a
                )) 

                :

                setUpdatedWalkIns(prev => prev.map(a => 
                    a._id === response.updatedInfo._id ? { ...a, status: 'Completed' } : a
                )) 

                setUpdatedBarber(prev => prev.map(a => a._id === barber._id ? { ...a, status: 'Available' } : a));
                onCancel(false);
            }
    
        }catch(err) {
            console.error('Error selecting customer:', err);
        }
    };
        

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50 shadow-lg'>
            <div className='relative w-[90%] max-w-[400px] bg-white rounded-2xl shadow-lg p-6'>
                <button className='absolute top-2 right-2 bg-transparent text-red-500' onClick={() => onCancel(false)}>X</button>

                <h1 className='text-2xl font-bold text-center text-gray-800 mb-6 tracking-tighter'>Mode of Payment</h1>

                <div className='flex flex-col gap-4'>
                    <button className='flex items-center justify-center gap-3 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition' onClick={(e) => handleComplete(e.target.textContent)}>
                        <FaMoneyBillWave className='text-xl' />
                        <span>Cash</span>
                    </button>

                    <button className='flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition' onClick={(e) => handleComplete(e.target.textContent)}>
                        <FaMobileAlt className='text-xl' />
                        <span>GCash</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCompleteModal;
