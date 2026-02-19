import React, { useState, useEffect } from 'react';
import { getMenu, createOrder } from '../api';

const Orders = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState(1);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenu();
                setMenuItems(response.data);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };
        fetchMenu();
    }, []);

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        try {
            await createOrder({
                table_number: tableNumber,
                items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
            });
            alert('Order placed successfully!');
            setCart([]);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Take Order</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => addToCart(item)}
                            className="p-4 border rounded shadow-sm hover:bg-gray-50 cursor-pointer transition"
                        >
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600">₹{item.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:w-1/3 border-l pl-4">
                <h3 className="text-xl font-bold mb-4">Current Order</h3>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Table Number
                    </label>
                    <input
                        type="number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(parseInt(e.target.value))}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        min="1"
                    />
                </div>

                <div className="space-y-2 mb-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <div>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold mr-2">₹{item.price * item.quantity}</span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold mb-4">
                        <span>Total:</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Orders;
