import React, { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";

const ProductSale = ({ product, onClose }) => {
  if (!product) return null;

  const { data, loading, error } = useFetch(
    `/sales/product/${product._id}`,
    null,
    null,
    [product._id]
  );

  // Compute totals once data is loaded
  const { totalQty, totalAmount } = useMemo(() => {
    if (!data || !Array.isArray(data)) return { totalQty: 0, totalAmount: 0 };

    let qty = 0;
    let amount = 0;

    data.forEach((record) => {
      const matchedProducts = record.products.filter(
        (p) => p.product._id === product._id
      );
      matchedProducts.forEach((p) => {
        qty += p.quantity;
        amount += p.quantity * p.product.price;
      });
    });

    return { totalQty: qty, totalAmount: amount };
  }, [data, product._id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white text-black rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          {product.name}
        </h1>

        {/* Loading & Error */}
        {loading && <p className="text-gray-500 text-center">Loading...</p>}
        {error && (
          <p className="text-red-500 text-center">
            Failed to load sales data.
          </p>
        )}

        {/* Sales Table */}
        {!loading && !error && data && data.length > 0 ? (
          <>
            <div className="overflow-y-auto max-h-[360px] border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="py-2 px-4 text-left">Branch</th>
                    <th className="py-2 px-4 text-left">Quantity</th>
                    <th className="py-2 px-4 text-left">Date Sold</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.flatMap((record) =>
                    record.products
                      .filter((p) => p.product._id === product._id)
                      .map((p, index) => (
                        <tr
                          key={`${record._id}-${index}`}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-2 px-4">{record.branch?.name || "—"}</td>
                          <td className="py-2 px-4">{p.quantity}</td>
                          <td className="py-2 px-4">
                            {new Date(record.createdAt).toISOString().split("T")[0]}
                          </td>
                          <td className="py-2 px-4">
                            ₱ {(p.quantity * p.product.price).toLocaleString()}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-center mt-4 font-semibold text-sm">
              <span>Total Quantity: {totalQty}</span>
              <span>
                Total Sales: ₱ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </>
        ) : (
          !loading && <p className="text-gray-500 text-center">No sales found for this product.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSale;
