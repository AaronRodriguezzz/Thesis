import React, { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { update_data } from "../../services/PutMethod";
import { useUser } from "../../hooks/userProtectionHooks";
import { useFetch } from "../../hooks/useFetch";
import POSLoading from "../../components/animations/POSLoading";

const POS = () => {
    const user = useUser();
    const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';
    const [searchTerm, setSearchTerm] = useState("");
    const [checkOutList, setCheckOutList] = useState([]);
    const [totalSummary, setTotalSummary] = useState(0)

    const { data, loading, error, setData } = useFetch(
        user ? `/products/${user.branchAssigned}` : null, 
        [user?.branchAssigned]
    );

    const productList = data?.products || [];

    const filteredProducts = useMemo(() => {
        return productList
        ? productList.filter(product =>
            product?.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.price?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.description?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];
    }, [productList, searchTerm]);

    const addTo_checkOutList = (item) => {

        const exist = checkOutList.find(p => p._id === item._id)

        if(exist){
            setCheckOutList(prevList => prevList.map(p => p._id === item._id ? { ...p, checkOutQuantity: p.checkOutQuantity + 1 } : p));
        }else{
            const newItem = {
                ...item,
                checkOutQuantity: 1,
            }

            setCheckOutList(prevList => [...prevList, newItem]);
        }

    }

    const removeItem = (id) => {
        const updatedList = checkOutList.filter(product => product._id !== id);

        setCheckOutList(updatedList);
    }

    const quantityChange = (id, value) => {
        const updatedList = checkOutList.map(product => {
            if (product._id === id) {
                const newQuantity = product.checkOutQuantity + value;
                return {
                    ...product,
                    checkOutQuantity: newQuantity, 
                };
            }
            return product;
        });

        setCheckOutList(updatedList);
    };

    const handle_finish = async () => {

        const checkOutPayload = {
            product: [...checkOutList],
            soldBy: user?._id,
            totalPrice: totalSummary,
            branch: user?.branchAssigned
        };

        try{
            const response = await update_data('/checkout_product', checkOutPayload);

            if (response.updatedData) {
                setCheckOutList([]);

                setData(prev => ({
                    ...prev,
                    products: prev.products.map(p => {
                        const updated = response.updatedData.find(prod => prod._id === p._id);
                        return updated ? updated : p;
                    }),
                }));
            }

        }catch(err){
            console.log(err);
        }
    }
  
    useEffect(() => {
        let totalAmount = 0;
        
        checkOutList.forEach(product => {
            totalAmount += product.price * product.checkOutQuantity;
        });

        setTotalSummary(totalAmount);
    },[checkOutList])

    if(loading) return <POSLoading />;
    if (error) return <p className="p-4 text-red-500">Error loading data</p>;

    return (
        <div className="flex min-h-screen">
            <main className="p-4 w-full">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tighter text-gray-800">Product Management</h1>
                    <p className="text-xs text-gray-500">Manage your product's stocks and prices.</p>
                </header>

                <div className="h-[80vh] flex flex-row gap-6">
                    <div className="flex-3 flex-col space-y-4">
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
                        </div>


                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex flex-row justify-between mb-4">
                                <h2 className="text-2xl font-semibold mb-4 tracking-tight">Product Catalog</h2>
                            </div>

                            <div className="h-[600px] w-full flex flex-row flex-wrap items-center justify-center gap-4 overflow-x-auto">
                                {filteredProducts.map((product) => (
                                    <div className="flex flex-col bg-gray-100 items-start p-4 w-[200px] shadow-md rounded-lg" key={product._id}>
                                        <img src={`${baseUrl}/${product.imagePath}`} alt="" className="w-[180px] h-[180px] rounded-lg mb-3 shadow-md"/>

                                        <div className="tracking-tighter" key={product._id}>
                                            <h1 className="text-sm font-bold">{product.name}</h1>
                                            <h3 className="text-sm font-semibold">₱ {product.price}</h3>
                                            <p className="text-sm font-semibold">
                                                On stock: {product?.stock[product.branch.findIndex(b => b === user.branchAssigned)] || 0}
                                            </p>
                                            <button 
                                                className="bg-green-500 rounded-full text-white px-2 text-md my-2 font-semibold disabled:opacity-50"
                                                onClick={() => addTo_checkOutList(product)}
                                                disabled={product?.stock[product.branch.findIndex(b => b === user.branchAssigned)] === checkOutList[checkOutList.findIndex(c => c._id === product._id)]?.checkOutQuantity }
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white space-y-5 rounded-md p-4">
                        <h1 className="font-semibold text-2xl tracking-tight py-2">Check Out Summary</h1>

                        <div className="h-[600px] overflow-y-auto space-y-4">
                            {checkOutList &&  checkOutList.map((product) => (
                                <div
                                    className="relative w-full flex gap-4 bg-gray-100 p-3 shadow-md rounded-lg items-start"
                                    key={product._id}
                                >
                                    {/* Image */}
                                    <img
                                        src={`${baseUrl}/${product.imagePath}`}
                                        alt=""
                                        className="w-[90px] h-[100px] object-cover rounded-lg shadow-md"
                                    />

                                {/* Product Details */}
                                    <div className="flex flex-col justify-between flex-1 tracking-tight h-full">
                                        <div className="space-y-1">
                                            <h1 className="text-md font-bold text-gray-800">{product.name}</h1>
                                            <h3 className="text-md font-semibold text-gray-600">₱ {product.price}</h3>
                                        </div>

                                        {/* Quantity & Remove */}
                                        <div className="flex flex-row sm:items-center justify-between mt-3 gap-y-2 sm:gap-y-0">
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <span>Qty:</span>
                                                <button 
                                                    className="bg-white px-2 text-lg" 
                                                    onClick={() => quantityChange(product._id, -1)}
                                                    disabled={product.checkOutQuantity === 1 }
                                                >
                                                    -
                                                </button>
                                                
                                                <span className="w-4 text-center">{product.checkOutQuantity}</span>

                                                <button 
                                                    className="bg-white px-2 text-lg" 
                                                    onClick={() => quantityChange(product._id, 1)}
                                                    disabled={product?.stock[product.branch.findIndex(b => b === user.branchAssigned)] === product.checkOutQuantity}
                                                >
                                                    +
                                                </button>
                                            </div>  

                                            <button 
                                                className="text-red-500 text-xs sm:text-sm hover:underline self-start sm:self-auto"
                                                onClick={() => removeItem(product?._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                        
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-xl font-semibold tracking-tight">Total Price: ₱{totalSummary || 0}.00</h1>
                        </div>
                        
                        <button 
                            disabled={checkOutList.length === 0}
                            className="w-full bg-green-400 text-white py-2 rounded-lg tracking-wide hover:bg-green-700 transition ease-in-out"
                            onClick={handle_finish}
                        >
                            FINISH
                        </button>
                    </div>  
                </div>
            </main>
        </div>
    );
};

export default POS;