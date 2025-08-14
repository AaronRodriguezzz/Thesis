import React, { useEffect, useState, useRef } from 'react';
import { update_data } from '../../services/PutMethod';
import { get_data } from '../../services/GetMethod';
import { post_data } from '../../services/PostMethod';

const NewProduct = ({ onCancel, route, setUpdatedData }) => {

    const defaultProduct = {
        name: '',
        imagePath: '',
        price: '',
        stock: '',
        branch: [],
        description: '',
        uploadType: 'products',
    };
    const fileInputRef = useRef(null);
    const [branches, setBranches] = useState([]);
    const [newProduct, setNewProduct] = useState(defaultProduct);
    const [debouncedInput, setDebouncedInput] = useState(defaultProduct);
    const [numberOfBranch, setNumberOfBranch] = useState('');
    const [displayedImage, setDisplayedImage] = useState('');

    const add_clicked = async (e) => {
        e.preventDefault();

        if(newProduct.description.length <= 100 && newProduct.name.length <= 25) {

            const formData = new FormData();

            formData.append("name", newProduct.name);
            formData.append("price", newProduct.price);
            formData.append("stock", newProduct.stock);
            formData.append("branch", newProduct.branch);
            formData.append("description", newProduct.description);
            formData.append("uploadType", "product");

            if (newProduct.imagePath) {
                formData.append("image", newProduct.imagePath); // File object
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
            setNewProduct({ ...newProduct, imagePath: selectedFile });
        }
    };


    // 🔁 Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInput(newProduct);
        }, 300);

        return () => clearTimeout(handler);
    }, [newProduct]);

    // 🔁 Fetch branches on mount
    useEffect(() => {
        const get_branches = async () => {
            const data = await get_data('/get_data/branch');

            if (data) {
                setBranches(data);
            }
        };

        get_branches();
    }, []);

    useEffect(() => {
        console.log(newProduct);
    },[newProduct])

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <form
                className='w-[90%] max-w-[400px] bg-white rounded-lg shadow-lg p-5 shadow-gray-400'
                onSubmit={add_clicked}
            >
                <h1 className='text-2xl font-semibold mb-4 tracking-tight'>New Product</h1>

                <div className='relative flex flex-col tracking-tighter'>

                    <div 
                        className='w-[150px] h-[170px]  mx-auto border-2 border-gray-200 rounded-lg flex items-center justify-center bg-center bg-cover bg-no-repeat'
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

                    <h1 className='mt-2'>Number of Branch</h1>
                    <select
                        value={numberOfBranch}
                        onChange={(e) => setNumberOfBranch(e.target.value)}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    >
                        <option value='' disabled>Select Number of Branch</option>
                        {branches && branches.map((_,index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
        
                    <h1 className='mt-2'>Product Name</h1>
                    <input
                        type='text'
                        value={newProduct.name}
                        maxLength={25}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value.toUpperCase() })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Price</h1>
                    <input
                        type='number'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                    <h1 className='mt-2'>Stock</h1>
                    <input
                        type='number'
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                    />

                
                    {Array.from({ length: numberOfBranch }).map((_, index) => (
                        <div key={index}>
                            <h1 className="mt-2">Branch {index + 1}</h1>
                            <select
                                value={newProduct?.branch[index] || ""}
                                className="w-full border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300"
                                onChange={(e) =>
                                    setNewProduct((prev) => {
                                        const updatedBranches = [...prev.branch];
                                        updatedBranches[index] = e.target.value;
                                        return { ...prev, branch: updatedBranches };
                                    })
                                }
                            >
                            <option value="" disabled>Select Branch</option>
                            {branches &&
                                branches
                                .filter(
                                    (branch) =>
                                    !newProduct.branch?.find(
                                        (id, i) =>
                                        i !== index && String(id) === String(branch._id)
                                    )
                                )
                                .map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                    {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <h1 className='mt-2'>Description</h1>
                    <textarea
                        type='number'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className='border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300'
                        maxLength={100}
                    />

                    <p className={`text-sm mt-1 ${newProduct.description.length === 100 ? 'text-red-500' : 'text-gray-500'}`}>
                        {newProduct.description.length}/100 characters
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

export default NewProduct;
