import React, { useEffect, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';
import { post_data } from '../../services/PostMethod';

const AssignCustomer = ({  onCancel, appointments, walkIn, setSelectedCustomer }) => {
    const [selectedCategory, setSelectedCategory] = useState('Appointment');
    

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

                <div className='min-h-[400px] flex flex-col'> 
                    {selectedCategory === 'Appointment' ? (
                        <div>
                            <div className='flex flex-col justify-start'>
                                <div className='w-full flex justify-between items-center bg-black text-white p-4 mt-2 rounded-l-lg'>
                                    <div className='tracking-tight text-sm'>
                                        <h1 className='text-lg font-semibold'>Renz Allen Rodriguez</h1>
                                        <p>Service: Hit & Wack</p>
                                        <p>Additional: Hot Towel</p>
                                        <p>Code: 3584</p>
                                    </div>
                                        

                                    <button className='h-full px-2'>
                                        <FaCaretRight className='text-3xl text-white'/>
                                    </button>
                                </div>
                                
                                <div className='w-full flex justify-between items-center bg-black text-white p-4 mt-2 rounded-l-lg'>
                                    <div className='tracking-tight text-sm'>
                                        <h1 className='text-lg font-semibold'>Renz Allen Rodriguez</h1>
                                        <p>Service: Hit & Wack</p>
                                        <p>Additional: Hot Towel</p>
                                        <p>Code: 3584</p>
                                    </div>
                                        

                                    <button className='h-full px-2'>
                                        <FaCaretRight className='text-3xl text-white'/>
                                    </button>
                                </div>

                                <div className='w-full flex justify-between items-center bg-black text-white p-4 mt-2 rounded-l-lg'>
                                    <div className='tracking-tight text-sm'>
                                        <h1 className='text-lg font-semibold'>Renz Allen Rodriguez</h1>
                                        <p>Service: Hit & Wack</p>
                                        <p>Additional: Hot Towel</p>
                                        <p>Code: 3584</p>
                                    </div>
                                        

                                    <button className='h-full px-2'>
                                        <FaCaretRight className='text-3xl text-white'/>
                                    </button>
                                </div>
                                 

                                 <button className='w-[100px] mt-2 bg-red-600 text-white' onClick={() => onCancel(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div> 
                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignCustomer;