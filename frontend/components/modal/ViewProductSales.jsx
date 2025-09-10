import React from "react";

export default function ViewSalesModal({ isOpen, onClose, sale }) {
  if (!isOpen || !sale) return null;

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50'>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Checkout Details
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 font-bold text-lg"
                >
                    ✕
                </button>
                </div>

                {/* Products List */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {sale.products.map((prod, idx) => (
                    <div
                    key={idx}
                    className="flex justify-between items-center pb-2"
                    >
                    <span className="text-gray-700 text-sm font-medium">
                        {prod.product?.name}
                    </span>
                    <span className="text-gray-500 text-sm">Qty: {prod.quantity}</span>
                    </div>
                ))}
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between items-center border-t pt-3">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="font-bold text-orange-500">
                    ₱ {sale.totalPrice}.00
                </span>
                </div>
            </div>
        </div>
    );
}
