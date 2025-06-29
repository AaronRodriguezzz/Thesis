import React, { useState, useEffect, useRef } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';

const UpdateProduct = ({ currentData, onCancel, setUpdatedData, route}) => {
    const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001/uploads/products' : 'https://tototumbs.onrender.com/uploads/products';
    const fileInputRef = useRef(null);
    const [displayedImage, setDisplayedImage] = useState('')
    const [branches, setBranches] = useState(null);
    const [newState, setNewState] = useState({  
        id: currentData?._id,
        name: currentData?.name,
        imagePath: currentData?.imagePath,
        price: currentData?.price,
        stock: currentData?.stock,
        branch: currentData?.branch,
        description: currentData?.description,
        uploadType: 'products',
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

    const handleFileClick = () => fileInputRef.current.click();

    const handleChangeFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageURL = URL.createObjectURL(selectedFile);
            setDisplayedImage(imageURL)
            setNewState({ ...newState, imagePath: selectedFile.name });
        }
    };
    
    // 🔁 Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInput(newState);
        }, 300);
    
        return () => clearTimeout(handler);
    }, [newState]);

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
            <form
                className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-lg p-5 shadow-gray-400'
                onSubmit={update_Clicked}
            >
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>Update Product</h1>

                <div className='flex flex-col tracking-tighter'>

                    <div 
                        className='w-[150px] h-[170px]  mx-auto border-2 border-gray-200 rounded-lg flex items-center justify-center bg-center bg-cover bg-no-repeat'
                        style={displayedImage ? { backgroundImage: `url(${displayedImage})` } : {backgroundImage: `url(${baseUrl}/${newState.imagePath})`}}
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
                            style={{opacity: .5, border:"none"}}
                        >
                            +
                        </h1>
                    </div>
        
                    <h1 className='mt-2'>Product Name</h1>
                    <input
                        type='text'
                        value={newState.name}
                        onChange={(e) => setNewState({ ...newState, name: e.target.value.toUpperCase() })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Price</h1>
                    <input
                        type='number'
                        value={newState.price}
                        onChange={(e) => setNewState({ ...newState, price: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Stock</h1>
                    <input
                        type='number'
                        value={newState.stock}
                        onChange={(e) => setNewState({ ...newState, stock: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Branch</h1>
                    <select
                        value={newState.branch}
                        onChange={(e) => setNewState({ ...newState, branch: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    >
                        <option value='' disabled>Select Branch</option>
                        {branches && branches.map(branch => (
                            <option key={branch?._id} value={branch?._id}>
                                {branch?.name}
                            </option>
                        ))}
                    </select>

                    <h1 className='mt-2'>Description</h1>
                    <textarea
                        type='number'
                        value={newState.description}
                        onChange={(e) => setNewState({ ...newState, description: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                        maxLength={100}
                    />

                    <p className={`text-sm mt-1 ${newState.description.length === 20 ? 'text-red-500' : 'text-gray-500'}`}>
                        {newState.description.length}/100 characters
                    </p>
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

export default UpdateProduct;