import React, { useState } from 'react';
import { update_data } from '../../services/PutMethod';

const BranchUpdateModal = ({ currentData, onCancel, setUpdatedData, route}) => {
    const [newState, setNewState] = useState({  
        id: currentData?._id,
        name: currentData?.name,
        address: currentData?.address, 
        phone: currentData?.phone, 
        numberOfBarber: currentData?.numberOfBarber, 
    })
  
    const update_Clicked = async (e) => {
        e.preventDefault();
        
        if (newState) {
            const info = await update_data(route, newState)

            setUpdatedData((prev) =>
                prev.map((item) =>
                    item._id === info?.updatedInfo?._id ? info?.updatedInfo : item
                )
            );

            onCancel(false);
        } else {
            alert('Please select a new status.');
        }
    };

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <form className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-sm p-5 shadow-gray-200' onSubmit={update_Clicked}>
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>
                    Current Customer Data
                </h1>

                <div className='flex flex-col tracking-tighter'>
                    <h1 className='mt-2'>Branch Name</h1>
                    <input
                        type='text'
                        value={newState.name}
                        onChange={(e) => setNewState({ ...newState, name: e.target.value.toUpperCase() })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Address</h1>
                    <input
                        type='text'
                        value={newState.address}
                        onChange={(e) => setNewState({ ...newState, address: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Phone</h1>
                    <input
                        type='text'
                        minLength={11}
                        maxLength={11}
                        value={newState.phone}
                        onChange={(e) => setNewState({ ...newState, phone: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Number Of Barbers</h1>
                    <input
                        type='number'
                        value={newState.numberOfBarber}
                        onChange={(e) => setNewState({ ...newState, numberOfBarber: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />
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
                        onClick={update_Clicked}
                        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition'
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BranchUpdateModal;