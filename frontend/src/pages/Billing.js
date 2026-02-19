import React, { useState, useEffect } from 'react';
import { getOrders, generateBill } from '../api';

const Billing = () => {
    const [orders, setOrders] = useState([]);
    const [generatedBill, setGeneratedBill] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            // Filter only pending or active orders if needed, for now showing all for simplicity
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleGenerateBill = async (orderId) => {
        try {
            const response = await generateBill(orderId);
            setGeneratedBill(response.data);
            fetchOrders(); // Refresh status
        } catch (error) {
            console.error('Error generating bill:', error);
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 no-print">
                <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="p-4 border rounded shadow-sm bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold">Table #{order.table_number}</h3>
                                    <span className={`text-xs px-2 py-1 rounded ${order.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <span className="text-gray-500 text-sm">{new Date(order.date).toLocaleString()}</span>
                            </div>

                            <div className="text-sm text-gray-600 mb-4">
                                {order.items.length} items
                            </div>

                            {order.status !== 'Paid' && (
                                <button
                                    onClick={() => handleGenerateBill(order.id)}
                                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                                >
                                    Generate Bill
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:w-1/2">
                {generatedBill && (
                    <div id="invoice-section" className="sticky top-4 border p-8 bg-white shadow-lg rounded">
                        <h2 className="text-3xl font-bold text-center mb-6 border-b pb-4">INVOICE</h2>

                        <div className="flex justify-between mb-4">
                            <span className="text-gray-600">Bill ID: #{generatedBill.id}</span>
                            <span className="text-gray-600">Date: {new Date(generatedBill.date).toLocaleDateString()}</span>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold text-lg">Order Details</h3>
                            <p>Order ID: {generatedBill.order_id}</p>
                        </div>

                        <div className="border-t border-b py-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>₹{generatedBill.total_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Tax (5%)</span>
                                <span>₹{generatedBill.tax_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
                                <span>Grand Total</span>
                                <span>₹{generatedBill.grand_total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-center text-gray-500 text-sm mt-8">
                            Thank you for dining with us!
                        </div>

                        <button
                            className="mt-6 w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900 print:hidden"
                            onClick={() => window.print()}
                        >
                            Print Invoice
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Billing;
