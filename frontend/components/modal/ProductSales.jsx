import { FaChartLine } from "react-icons/fa";
import { useFetch } from "../../hooks/useFetch";

export default function ProductSalesViewModal({ onClose, id }) {
    const baseUrl = import.meta.env.MODE === 'development'
        ? 'http://localhost:4001'
        : 'https://tototumbs.onrender.com';

    const { data, loading, error } = useFetch(`/sales/product/${id}`, null, null, [id])

    console.log(data);
    const totalQuantity = sales.reduce((sum, sale) => {
        const productSale = sale.products.find(
        (p) => p.product._id === product._id
        );
        return sum + (productSale ? productSale.quantity : 0);
    }, 0);

    const totalRevenue = totalQuantity * product.price;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="w-[90%] max-w-2xl bg-white rounded-xl shadow-md p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <FaChartLine className="w-6 h-6 text-gray-800" />
                <h1 className="text-xl font-semibold tracking-tight text-black">
                    {data.product.name} — Sales Summary
                </h1>
            </div>
            <button
                type="button"
                onClick={() => onClose(false)}
                className="text-gray-500 hover:text-gray-700"
            >
                ✕
            </button>
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-4 mb-5">
            <img
                src={`${baseUrl}/${product.imagePath}`} 
                alt={data.product.name}
                className="w-[80px] h-[80px] rounded-lg object-cover border border-gray-200"
            />
            <div>
                <h2 className="text-lg font-semibold text-gray-800">{data.product.name}</h2>
                <p className="text-sm text-gray-600">₱{data.product.price} per item</p>
            </div>
            </div>

            {/* Sales Table */}
            <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg p-3">
            {loading ? (
                <p className="text-center text-gray-500 text-sm">Loading sales...</p>
            ) : data.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">
                    No sales found for this product.
                </p>
            ) : (
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="sticky top-0 bg-gray-100 text-gray-800 font-semibold text-xs uppercase">
                        <tr>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Branch</th>
                        <th className="px-3 py-2">Sold By</th>
                        <th className="px-3 py-2">Qty</th>
                        <th className="px-3 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((sale, index) => {

                            const productSales = data.products.find(p => p.product._id === id)
                            
                            return (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                <td className="px-3 py-2">
                                    {new Date(sale.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-2">
                                    {sale.branch?.name || "N/A"}
                                </td>
                                <td className="px-3 py-2">
                                    {sale.soldBy.fullName || "N/A"}
                                </td>
                                <td className="px-3 py-2 text-center">
                                    {productSale.quantity}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    ₱{(productSale.quantity * product.price).toLocaleString()}
                                </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            </div>

            {/* Totals */}
            <div className="mt-4 border-t border-gray-200 pt-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
                Total Quantity Sold:
            </h2>
            <span className="text-lg font-bold text-gray-700">{totalQuantity}</span>
            </div>

            <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Total Revenue:</h2>
            <span className="text-lg font-bold text-green-600">
                ₱{totalRevenue.toLocaleString()}
            </span>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-black hover:bg-black/80 transition text-sm text-white"
            >
                Close
            </button>
            </div>
        </div>
        </div>
    );
}
