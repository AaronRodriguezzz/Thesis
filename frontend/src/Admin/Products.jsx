import { useState, useMemo } from "react";
import { FaUserPlus, FaSearch, FaEdit, FaClipboardList } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";

import ProductModal from "../../components/modal/AddProductModal";
import ProductSale from "../../components/modal/ProductSale";
import { useFetch } from "../../hooks/useFetch";

const Products = () => {
    const baseUrl = import.meta.env.MODE === "development"
        ? "http://localhost:4001"
        : "https://tototumbs.onrender.com";

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [addingProduct, setAddingProduct] = useState(false);
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [productSaleOpen, setProductSaleOpen] = useState(false);
    const [productToView, setProductToView] = useState(null);

    const {
        products: productList,
        pageCount,
        loading,
        error,
        setData: setProductList,
    } = useFetch(`/products?page=${page}`);

    const filteredProducts = useMemo(() => {
        if (!productList) return [];
        return productList.filter((product) =>
            product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.price?.toString().includes(searchTerm.toLowerCase()) ||
            product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [productList, searchTerm]);

    return (
        <div className="text-white">
            <main className="p-4 w-full">
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">

                        {/* Search + Add */}
                        <div className="w-full bg-black/40 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-md">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search products (Name, Price, Description)..."
                                    className="w-full pl-10 pr-4 py-2 border border-white/10 bg-white/10 rounded-full text-sm text-white placeholder-white/60 tracking-tight focus:outline-none focus:ring-1 focus:ring-white/40"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                            </div>

                            <button
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all py-2 px-6 rounded-full text-white text-sm tracking-tighter"
                                onClick={() => setAddingProduct(true)}
                            >
                                <FaUserPlus /> Add Product
                            </button>
                        </div>

                        {/* Catalog */}
                        <div className="bg-black/40 p-6 rounded-lg shadow-lg backdrop-blur-md">
                            <div className="flex flex-row justify-between mb-4">
                                <h2 className="text-2xl font-semibold tracking-tight">Product Catalog</h2>

                                <Pagination
                                    count={pageCount || 1}
                                    size="small"
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                    sx={{
                                        "& .MuiPaginationItem-root": { color: "white" },
                                        "& .Mui-selected": {
                                            backgroundColor: "rgba(255,255,255,0.2) !important",
                                        },
                                    }}
                                />
                            </div>

                            {/* Loading */}
                            {loading && (
                                <div className="text-center py-20 text-white/70">
                                    Loading products...
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="text-center py-20 text-red-400">
                                    Failed to load products.
                                </div>
                            )}

                            {/* Product Cards */}
                            {!loading && !error && (
                                <div className="min-h-[420px] w-full flex flex-row flex-wrap items-center justify-center gap-4">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className="flex flex-col bg-white/10 items-center p-4 w-[220px] shadow-lg rounded-lg hover:bg-white/20 transition-all"
                                        >
                                            <img
                                                src={`${baseUrl}/${product.imagePath}`}
                                                alt={product.name}
                                                className="w-[180px] h-[200px] rounded-lg mb-3 shadow-md object-cover"
                                            />

                                            <div className="tracking-tighter text-center">
                                                <h1 className="text-sm font-bold">{product.name}</h1>
                                                <h3 className="text-sm font-semibold text-orange-400">
                                                    ₱ {product.price}
                                                </h3>
                                                <p className="text-xs text-white/70 line-clamp-3">
                                                    {product.description}
                                                </p>

                                                <div className="flex justify-center mt-3 gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setOnUpdate(true);
                                                            setUpdatingData(product);
                                                        }}
                                                        className="text-white/70 hover:text-orange-400 transition-colors"
                                                    >
                                                        <FaEdit size={20} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setProductSaleOpen(true);
                                                            setProductToView(product);
                                                        }}
                                                        className="text-white/70 hover:text-blue-400 transition-colors"
                                                    >
                                                        <FaClipboardList size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Modal */}
            {addingProduct && (
                <ProductModal
                    setUpdatedData={setProductList}
                    onCancel={setAddingProduct}
                    route={"/new_product"}
                    dataToUpdate={null}
                />
            )}

            {/* Update Modal */}
            {onUpdate && updatingData && (
                <ProductModal
                    dataToUpdate={updatingData}
                    setUpdatedData={setProductList}
                    onCancel={setOnUpdate}
                    route={"/update_product"}
                />
            )}

            {/* Sales Modal */}
            {productSaleOpen && (
                <ProductSale
                    onClose={setProductSaleOpen}
                    product={productToView}
                />
            )}
        </div>
    );
};

export default Products;
