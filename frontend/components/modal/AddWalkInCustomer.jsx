import React, { useEffect, useState } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';
import { post_data } from '../../services/PostMethod';

const NewWalkInCustomer = ({  onCancel, setUpdatedData, barbers }) => {
    const frontDesk = JSON.parse(localStorage.getItem('admin'));
    const [totalPayment, setTotalPayment] = useState(0);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState(null);
    const [walkInCustomer, setWalkInCustomer] = useState({
        customerName: '',
        service: '',
        additionalService: '',
        barber: '',
        branch: frontDesk?.branchAssigned,
        totalAmount: '',
        paymentMethod: '',
        recordedBy: frontDesk?._id,
    })

    const add_clicked = async (e) => {
        e.preventDefault();

        setLoading(true)
        const newWalkInRes = await post_data(walkInCustomer, '/new-walkIn')

        if(newWalkInRes){
            onCancel(false);
            setUpdatedData(prev => [...prev, newWalkInRes.walkIn])
        }

        setLoading(false);
    }

    useEffect(() => {
        
        const total = services?.reduce((sum, service) => {
            if (
                service._id === walkInCustomer?.service ||
                service._id === walkInCustomer?.additionalService
            ) {
                return sum + service.price;
            }
            return sum;
        }, 0);

        setTotalPayment(total);
        setWalkInCustomer({...walkInCustomer, totalAmount: total});
    },[walkInCustomer.service, walkInCustomer.additionalService])

    useEffect(() => {
        const get_services = async () => {
            const data = await get_data('/services');
        
            //exclude the barber's password
            if (data?.services) {
                setServices(data.services);
            }
        };
        get_services();
    }, []);

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <form className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-sm p-5 shadow-gray-200' onSubmit={add_clicked}>
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>
                    New Employee
                </h1>

                <div className='flex flex-col tracking-tighter'>
                    <label className='mt-2' htmlFor='customerName'>Customer Name</label>
                    <input
                        type='text'
                        id='customerName'
                        value={walkInCustomer.customerName}
                        onChange={(e) => setWalkInCustomer({ ...walkInCustomer, customerName: e.target.value })}
                        className='border-1 border-gray-200 px-3 py-2 rounded-md focus:border-gray-300'
                    />

                    
                    <label className='mt-2' htmlFor='service'>Service</label>
                    <select
                        id="service"
                        value={walkInCustomer.service}
                        onChange={(e) => setWalkInCustomer({ ...walkInCustomer, service: e.target.value })}
                        className="border-1 border-gray-200 px-3 py-2 rounded mb-3"
                        required
                    >
                        <option value="" disabled>Select Service</option>
                        {services &&
                            services.map(
                                (service) =>
                                    service.serviceType === 'Package Service' && (
                                        <option key={service._id} value={service._id}>
                                            {service.name}
                                        </option>
                                )
                            )
                        }
                    </select>

                    <label htmlFor="additionalService">Additional Service</label>
                    <select
                        id="additionalService"
                        value={walkInCustomer.additionalService}
                        onChange={(e) => setWalkInCustomer({ ...walkInCustomer, additionalService: e.target.value })}
                        className="border-1 border-gray-200 px-3 py-2 rounded mb-3"
                    >
                        <option value="" disabled>Select Extra Service (Optional)</option>
                        {services &&
                        services.map(
                            (service) =>
                            service.serviceType === 'Additional Service' && (
                                <option key={service._id} value={service._id}>
                                    {service.name}
                                </option>
                            )
                        )}
                    </select>
                    
                    <label htmlFor="barber">Additional Service</label>
                    <select
                        id="barber"
                        value={walkInCustomer.barber}
                        onChange={(e) => setWalkInCustomer({ ...walkInCustomer, barber: e.target.value })}
                        className="border-1 border-gray-200 px-3 py-2 rounded mb-3"
                    >
                        <option value="" disabled>Select Barber</option>
                        {barbers &&
                            barbers.map(
                                (barber) =>  (
                                    <option key={barber?._id} value={barber?._id}>
                                        {barber?.fullName}
                                    </option>
                                )
                            )
                        }
                    </select>


                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                        id="paymentMethod"
                        value={walkInCustomer.paymentMethod}
                        onChange={(e) => setWalkInCustomer({ ...walkInCustomer, paymentMethod: e.target.value })}
                        className="border-1 border-gray-200 px-3 py-2 rounded mb-3"
                        required
                    >
                        <option value="" disabled>Select Payment Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Gcash">Gcash</option>
                    </select>

                    <p>Total Payment: ₱{totalPayment}.00 </p>

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
                        disabled={loading}
                    >
                        {loading ? 'Adding...': 'Finish'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewWalkInCustomer;