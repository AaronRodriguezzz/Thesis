import React, { useEffect, useState, useMemo } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaClipboardList } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { delete_data } from "../../services/DeleteMethod";
import ProductModal from "../../components/modal/AddProductModal";

const Products = () => {
    const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';
    const [productList, setProductList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [addingProduct, setAddingProduct] = useState(false);

    const filteredProducts = useMemo(() => {
        return productList && productList.filter(product =>
            product?.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.price.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.description.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [productList, searchTerm]);  


    const handle_delete = async (e, id) => {
        e.preventDefault();

        const data = await delete_data(id, '/delete_product');

        if (data.deleted) {
            setProductList(prev => prev.filter(product => product._id !== id));
        }
    }

    const handle_update = (data) => {
        setOnUpdate(true);
        setUpdatingData(data);
    }


    useEffect(() => {
        const get_products = async () => {
            const data = await get_data('/products', page);
        
            //exclude the barber's password
            if (data) {
                setProductList(data.products);
                setPaginationLimit(data.pageCount);
            }
        };
        get_products();
    }, [page]);


    console.log(addingProduct)

    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tighter text-gray-800">Product Management</h1>
                    <p className="text-xs text-gray-500">Manage your product's stocks and prices.</p>
                </header>

                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input 
                                    type="text"
                                    placeholder="Search employees (Name, Role, Email)..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            <button 
                                className="relative flex items-center gap-2 bg-gray-700 py-2 px-6 text-white rounded-full tracking-tighter text-sm"
                                onClick={() => setAddingProduct(true)}
                            >                          
                                Add Product 
                            </button>
                        </div>


                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex flex-row justify-between mb-4">
                                <h2 className="text-2xl font-semibold mb-4 tracking-tight">Product Catalog</h2>
                                <Pagination
                                    count={paginationLimit}
                                    size="small"
                                    page={page}
                                    onChange={(event, value) => setPage(value)}
                                />
                            </div>

                            <div className="min-h-[420px] w-full flex flex-row flex-wrap items-center justify-center gap-4">
                                {filteredProducts.map((product) => (
                                    <div className="flex flex-col bg-gray-100 items-center p-4 w-[220px] shadow-md rounded-lg" key={product._id}>
                                        <img src={`${baseUrl}/${product.imagePath}`} alt="" className="w-[180px] h-[200px] rounded-lg mb-3 shadow-md"/>

                                        <div className="tracking-tighter" key={product._id}>
                                            <h1 className="text-sm font-bold">{product.name}</h1>
                                            <h3 className="text-sm font-semibold">P {product.price}</h3>
                                            <p className="text-xs">{product.description}</p>

                                            <div className="flex mt-3 gap-2">
                                                <button
                                                    onClick={() => handle_update(product)}
                                                    className="text-gray-500 hover:text-gray-800"
                                                >       
                                                    <FaEdit size={22} />
                                                </button>
                                                <button
                                                    onClick={(e) => handle_delete(e, product._id)}
                                                    className="text-gray-500 hover:text-gray-800"
                                                >
                                                    <FaTrash size={22} />
                                                </button>
                                                <button
                                                    onClick={() => console.log(product.id)}
                                                    className="text-gray-500 hover:text-gray-800"
                                                >
                                                    <FaClipboardList size={22} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                            </div>
                        </div>
                        
                    </div>
                </div>
            </main>

            {addingProduct && 
                <ProductModal 
                    setUpdatedData={setProductList}
                    onCancel={setAddingProduct} 
                    route={'/new_product'}
                    dataToUpdate={null} 
                />
            }

            {onUpdate && updatingData &&
                <ProductModal 
                    dataToUpdate={updatingData} 
                    setUpdatedData={setProductList}
                    onCancel={setOnUpdate} 
                    route={'/update_product'}
                />
            }
        </div>
    );
};

export default Products;