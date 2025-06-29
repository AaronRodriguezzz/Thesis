import React, { useEffect, useState } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';
import { post_data } from '../../services/PostMethod';

const NewService = ({  onCancel, route, setUpdatedData}) => {
    const [newService, setNewService] = useState({
        name: '',
        price: '',
        duration: '',
        description: '',
        serviceType: ''
    })

    const add_clicked = async (e) => {
        e.preventDefault();
        const new_service = await post_data(newService, route)


        if(new_service){
            setUpdatedData(prev => [...prev, new_service.service]);
            onCancel(false);
        }
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <form className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-sm p-5 shadow-gray-200' onSubmit={add_clicked}>
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>
                    New Service
                </h1>

                <div className='flex flex-col tracking-tighter'>
                    <h1 className='mt-2'>Service Name</h1>
                    <input
                        type='text'
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value.toUpperCase() })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                        required
                    />

                    <h1 className='mt-2'>Price</h1>
                    <input
                        type='number'
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                        required
                    />

                    <h1 className='mt-2'>Duration in Minutes</h1>
                    <input
                        type='number'
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                        required
                    />

                    <h1 className='mt-2'>Service Type</h1>
                    <select
                        value={newService.serviceType}
                        onChange={(e) => setNewService({ ...newService, serviceType: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                        required
                    >
                        <option value='' disabled>Select Service Type</option>
                        <option value="Package Service">Package Service</option>
                        <option value="Additional Service">Additional Service</option>
                    </select>

                    <h1 className='mt-2'>Service Description</h1>
                    <textarea
                        type='number'
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                        maxLength={100}
                        required
                    />

                    <p className={`text-sm mt-1 ${newService.description.length === 100 ? 'text-red-500' : 'text-gray-500'}`}>
                        {newService.description.length}/100 characters
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
                        Finish
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewService;