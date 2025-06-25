import React, { useState } from 'react';
import { update_data } from '../../services/PutMethod';

const CustomerUpdateModal = ({ currentData, onCancel, setUpdatedData, route}) => {
    console.log(currentData?._id);
    const [newState, setNewState] = useState({  
        id: currentData?._id,
        email: currentData?.email,
        lastName: currentData?.lastName, 
        firstName: currentData?.firstName, 
        phone: currentData?.phone, 
        status: currentData?.status,
    })
  
    const update_Clicked = async () => {
        if (newState) {
            const info = await update_data(route, newState)

            setUpdatedData((prev) =>
                prev.map((item) =>
                    item._id === info?.customer?._id ? info.customer : item
                )
            );

            onCancel(false);
        } else {
            alert('Please select a new status.');
        }
    };

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <div className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-sm p-5 shadow-gray-200 '>
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>
                    Current Customer Data
                </h1>



                <div className='flex flex-col tracking-tighter'>
                    <h1 className='mt-2'>Email</h1>
                    <input
                        value={newState.email}
                        onChange={(e) => setNewState({ ...newState, email: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    <div className='flex flex-row gap-x-2'>
                        <div className='w-[50%]'>
                            <h1 className='mt-2'>Last Name</h1>
                            <input
                                value={newState.lastName}
                                onChange={(e) => setNewState({ ...newState, lastName: e.target.value })}
                                className='w-full border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                            />
                        </div>
                    
                        <div className='w-[50%]'>
                            <h1 className='mt-2'>First Name</h1>
                            <input
                                value={newState.firstName}
                                onChange={(e) => setNewState({ ...newState, firstName: e.target.value })}
                                className='w-full border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'

                            />
                        </div>
                    </div>

                    

                    <h1 className='mt-2'>Contact Number</h1>
                    <input
                        value={newState.phone}
                        onChange={(e) => setNewState({ ...newState, phone: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Status</h1>
                    <select
                        value={newState.status}
                        onChange={(e) => setNewState({ ...newState, status: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className='flex justify-end gap-2 mt-4'>
                    <button
                        onClick={() => onCancel(false)}
                        className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition'
                    >
                        Cancel
                    </button>
                    
                    <button
                        onClick={update_Clicked}
                        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition'
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerUpdateModal;