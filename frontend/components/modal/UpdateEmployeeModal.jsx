import React, { useState, useEffect } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';

const UpdateEmployee = ({ currentData, onCancel, setUpdatedData, route}) => {
    const [branches, setBranches] = useState(null);
    console.log(currentData);
    const [newState, setNewState] = useState({  
        id: currentData?._id,
        email: currentData?.email,
        fullName: currentData?.fullName, 
        branchAssigned: currentData?.branchAssigned, 
        role: currentData?.role
    })
  
    const update_Clicked = async () => {
        if (newState) {
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
        console.log('brancnhes', branches);
    },[branches])

    useEffect(() => {
        const get_branches = async () => {
            const data = await get_data('/get_data/branch')

            console.log(data);
            if(data){
                setBranches(data);
            }
        }
    
        get_branches();
    },[])
    

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <div className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-sm p-5 shadow-gray-200 '>
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>
                    Update Employee's Data
                </h1>

                <form className='flex flex-col tracking-tighter'>
                    <h1 className='mt-2'>Email</h1>
                    <input
                        type='email'
                        value={newState.email}
                        onChange={(e) => setNewState({ ...newState, email: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Full Name</h1>
                    <input
                        value={newState.fullName}
                        onChange={(e) => setNewState({ ...newState, fullName: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Branch Assigned</h1>
                    <select
                        value={newState.branchAssigned}
                        onChange={(e) => setNewState({ ...newState, branchAssigned: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    >
                        {branches && branches.map((branch) => (
                            <option key={branch?._id} value={branch?.name}>{branch?.name}</option>
                        ))}
                    </select>

                    <h1 className='mt-2'>Role</h1>
                    <select
                        value={newState.role}
                        onChange={(e) => setNewState({ ...newState, role: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    >
                        <option value="Front Desk">Front Desk</option>
                        <option value="Barber">Barber</option>
                    </select>
                </form>

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

export default UpdateEmployee;