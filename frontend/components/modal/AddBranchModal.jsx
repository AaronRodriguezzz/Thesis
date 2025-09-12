import React, { useEffect, useState, useRef } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';
import { post_data } from '../../services/PostMethod';

const NewBranch = ({ onCancel, route, setUpdatedData }) => {

    const fileInputRef = useRef(null);
    const [newBranch, setNewBranch] = useState({
        name: '',
        imagePath: '',
        address: '',
        phone: '',
        numberOfBarber: 0,
    });
    const [debouncedInput, setDebouncedInput] = useState(newBranch);
    const [displayedImage, setDisplayedImage] = useState('')

    const add_clicked = async (e) => {
        e.preventDefault();

        if(newBranch) {
            const formData = new FormData();

            formData.append("name", newBranch.name);
            formData.append("address", newBranch.address);
            formData.append("phone", newBranch.phone);
            formData.append("numberOfBarber", newBranch.numberOfBarber);
            formData.append("uploadType", "branch");

            if (newBranch.imagePath) {
                formData.append("image", newBranch.imagePath); // File object
            }

            const result = await post_data(formData, route);

            if (result?.added) {
                onCancel(false);
            }
        }
    };

    const handleFileClick = () => fileInputRef.current.click();

    const handleChangeFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageURL = URL.createObjectURL(selectedFile);
            setDisplayedImage(imageURL)
            setNewBranch({ ...newBranch, imagePath: selectedFile });
        }
    };


    // 🔁 Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInput(newBranch);
        }, 300);

        return () => clearTimeout(handler);
    }, [newBranch]);


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <form
                className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-lg p-5 shadow-gray-400'
                onSubmit={add_clicked}
            >
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>New Branch</h1>

                <div className='flex flex-col tracking-tighter'>

                    <div 
                        className='w-full h-[170px]  mx-auto border-2 border-gray-200 rounded-lg flex items-center justify-center bg-center bg-cover bg-no-repeat'
                        style={displayedImage ? { backgroundImage: `url(${displayedImage})` } : {}}
                        onClick={handleFileClick}
                    >
                        <input 
                            type="file" 
                            className='hidden' 
                            accept='image/*' 
                            ref={fileInputRef} 
                            onChange={handleChangeFile} 
                        />
                        <h1 
                            className='p-4 rounded-xl border-dotted border-2 border-gray-200 text-3xl font-semibold text-gray-200'
                            style={displayedImage ? { opacity: .5, border:"none" } : {}}
                        >
                            +
                        </h1>
                    </div>
        
                    <h1 className='mt-2'>Branch Name</h1>
                    <input
                        type='text'
                        value={newBranch.name}
                        onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value.toUpperCase() })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Address</h1>
                    <input
                        type='text'
                        value={newBranch.address}
                        onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Phone</h1>
                    <input
                        type='text'
                        minLength={11}
                        maxLength={11}
                        value={newBranch.phone}
                        onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Number Of Barbers</h1>
                    <input
                        type='number'
                        value={newBranch.numberOfBarber}
                        onChange={(e) => setNewBranch({ ...newBranch, numberOfBarber: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />
                </div>

                <div className='flex justify-end gap-2 mt-4'>
                    <button
                        type='button'
                        onClick={() => onCancel(false)}
                        className='px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 transition'
                    >
                        Cancel
                    </button>

                    <button
                        type='submit'
                        className='px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition'
                    >
                        Finish
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewBranch;
