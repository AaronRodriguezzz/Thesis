import React, { useState, useEffect } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';

const UpdateEmployee = ({ currentData, onCancel, setUpdatedData }) => {
    console.log(currentData);
    const [branches, setBranches] = useState(null);
    const [newState, setNewState] = useState({  
        id: currentData._id,
        email: currentData.email,
        fullName: currentData.fullName, 
        branchAssigned: currentData?.branchAssigned || '', 
        status: currentData.status,
        role: currentData.role
    })
  
    const update_Clicked = async () => {

        if(newState.branchAssigned === '') delete newState.branchAssigned

        const info = await update_data("/update_employee", newState)

        setUpdatedData((prev) => ({
            employees: prev.employees.map((item) =>
                item._id === info.updatedInfo._id ? info.updatedInfo : item
            )
        }));

        onCancel(false);
    };

    useEffect(() => {
        const get_branches = async () => {
            const data = await get_data('/get_data/branch')

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
                    <label className='mt-2'>Email</label>
                    <input
                        type='email'
                        value={newState.email}
                        onChange={(e) => setNewState({ ...newState, email: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    <label className='mt-2'>Full Name</label>
                    <input
                        value={newState.fullName}
                        onChange={(e) => setNewState({ ...newState, fullName: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    {('branchAssigned' in currentData) && 
                        <>
                            <label className='mt-2'>Branch Assigned</label>
                            <select
                                value={newState.branchAssigned}
                                onChange={(e) => setNewState({ ...newState, branchAssigned: e.target.value })}
                                className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                            >
                                {branches && branches.map((branch) => (
                                    <option key={branch?._id} value={branch?.name}>{branch?.name}</option>
                                ))}
                            </select>
                        </>
                    }

                    <label className='mt-2'>Role</label>
                    <select
                        value={newState.role}
                        onChange={(e) => setNewState({ ...newState, role: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    >
                        <option value="Front Desk">Front Desk</option>
                        <option value="Barber">Barber</option>
                    </select>

                    {(currentData.role === 'Admin' || currentData.branchAssigned?.status !== 'Open') && (
                        <>
                            <label className="mt-2">Status</label>
                            <select
                                value={newState.status}
                                onChange={(e) => setNewState({ ...newState, status: e.target.value })}
                                className="border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300"
                            >
                                {['On Leave', 'Active', 'Disabled']
                                    .filter(status => {
                                    if (currentData.role === 'Barber') {
                                        return ['On Leave', 'Disabled', 'Active'].includes(status);
                                    }

                                    if (currentData.role === 'Admin' || currentData.role === 'Front Desk') {
                                        return ['Active', 'Disabled'].includes(status);
                                    }

                                    return true;
                                    })
                                    .map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))
                                }
                                <option value={currentData.status}>No Status Change</option>
                            </select>
                        </>
                    )}
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