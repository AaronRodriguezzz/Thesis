import React, { useState, useEffect } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';

const UpdateService = ({ currentData, onCancel, setUpdatedData, route}) => {
    const [newState, setNewState] = useState({  
        id: currentData?._id,
        name: currentData?.name,
        price: currentData?.price, 
        duration: currentData?.duration, 
        description: currentData?.description,
        serviceType: currentData?.serviceType
    })
    const [debouncedInput, setDebouncedInput] = useState(newState);
    
  
    const update_Clicked = async (e) => {
        e.preventDefault();
        if (newState && newState.description.length <= 100) {
            
            const info = await update_data(route, newState)

            setUpdatedData((prev) =>
                prev.map((item) =>
                    item._id === info?.updatedInfo?._id ? info.updatedInfo : item
                )
            );

            onCancel(false);
        } else {
            alert('Please select a new status.');
        }
    };

     useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedInput(newState);
            }, 300);
        
            return () => clearTimeout(handler);
        }, [newState]);
    
    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <form className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-sm p-5 shadow-gray-200' onSubmit={update_Clicked}>
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>
                    Update Employee's Data
                </h1>

                <div className='flex flex-col tracking-tighter'>
                    <h1 className='mt-2'>Service Name</h1>
                    <input
                        type='text'
                        value={newState.name}
                        onChange={(e) => setNewState({ ...newState, name: e.target.value.toUpperCase() })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                        required
                    />

                    <h1 className='mt-2'>Price</h1>
                    <input
                        type='number'
                        value={newState.price}
                        onChange={(e) => setNewState({ ...newState, price: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                        required
                    />

                    <h1 className='mt-2'>Duration in Minutes</h1>
                    <input
                        type='number'
                        value={newState.duration}
                        onChange={(e) => setNewState({ ...newState, duration: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                        required
                    />

                    <h1 className='mt-2'>Service Type</h1>
                    <select
                        value={newState.serviceType}
                        onChange={(e) => setNewState({ ...newState, serviceType: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                        required
                    >
                        <option value='' disabled>Select Service Type</option>
                        <option value="Front Desk">Package Service</option>
                        <option value="Barber">Additional Service</option>
                    </select>

                    <h1 className='mt-2'>Service Description</h1>
                    <textarea
                        type='number'
                        value={newState.description}
                        onChange={(e) => setNewState({ ...newState, description: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                        maxLength={100}
                        required
                    />

                    <p className={`text-sm mt-1 ${newState.description.length === 100 ? 'text-red-500' : 'text-gray-500'}`}>
                        {newState.description.length}/100 characters
                    </p>
                </div>

                <div className='flex justify-end gap-2 mt-4'>
                    <button
                        onClick={() => onCancel(false)}
                        className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition'
                    >
                        Cancel
                    </button>
                    
                    <button
                        type='submit'
                        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition'
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateService;