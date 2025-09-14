import React from "react";
import { useFetch } from "../../hooks/useFetch";

const ProductSale = ({ id, isOpen, onClose }) => {
  const url = isOpen && id ? `/sales/product/${id}` : null;
  const { data, loading, error } = useFetch(url, null, [url, id]);

  console.log('hello', data);
  if (!isOpen) return null; // only render modal when open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
            <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
            ✕
            </button>

            <h1 className="text-xl font-bold mb-4">Product Sales</h1>

            {loading && <p className="text-gray-500">Loading...</p>}
            {!loading && !error && data && (
                <div className="space-y-3 h-[320px] overflow-y-auto bg-yellow">
                    {data.length > 0 ? (
                        data.map((item) => {
                            return item.products.filter( i => i.product._id === id).map((p, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between py-2 text-sm"
                                >
                                    <span className="font-medium">
                                        {p.product?.name || "Unnamed Product"}
                                    </span>
                                    <span>Qty: {p.quantity}</span>
                                    <span>₱ {p.quantity * p.product.price}</span>
                                    <span>{item.branch.name}</span>
                                </div>
                            ))    
                        })
                    ) : (
                    <p className="text-gray-500">No products found for this sale.</p>
                    )}

                </div>
            )}
        </div>
    </div>
  );
};

export default ProductSale;
