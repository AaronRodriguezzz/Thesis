import React, { useEffect, useState } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';
import { post_data } from '../../services/PostMethod';

const NewEmployee = ({  onCancel, route, setUpdatedData}) => {
    const [branches, setBranches] = useState([]);
    const [newEmployee, setNewEmployee] = useState({
        email: '',
        fullName: '',
        password: '',
        branchAssigned: '',
        role: ''
    })

    const add_clicked = async (e) => {
        e.preventDefault();
        const new_employee = await post_data(newEmployee, route)


        if(new_employee.added){
            onCancel(false);
        }
    }

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
            <form className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-sm p-5 shadow-gray-200' onSubmit={add_clicked}>
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>
                    New Employee
                </h1>

                <div className='flex flex-col tracking-tighter'>
                    <h1 className='mt-2'>Email</h1>
                    <input
                        type='email'
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Full Name</h1>
                    <input
                        value={newEmployee.fullName}
                        onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    

                    <h1 className='mt-2'>Password</h1>
                    <input
                        type='password'
                        minLength={8}
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Branch Assigned</h1>
                    {/* this should check if the barber length is already filled or not */}
                    <select
                        value={newEmployee.branchAssigned}
                        onChange={(e) => setNewEmployee({ ...newEmployee, branchAssigned: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    >
                        <option value='' disabled>Select Branch</option>
                        {branches && branches.map(branch => (
                            <option key={branch?._id} value={branch?._id}>{branch?.name}</option>
                        ))}
                    </select>

                    <h1 className='mt-2'>Role</h1>
                    <select
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    >
                        <option value='' disabled>Select Role</option>
                        <option value="Front Desk">Front Desk</option>
                        <option value="Barber">Barber</option>
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
                        type='submit'
                        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition'
                    >
                        Finish
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewEmployee;