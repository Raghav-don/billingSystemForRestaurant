import React, { useState, useEffect } from 'react';
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../api';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await getMenu();
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };

    const handleDataSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateMenuItem(editingId, newItem);
                setEditingId(null);
            } else {
                await addMenuItem(newItem);
            }
            setNewItem({ name: '', price: '', category: '' });
            fetchMenu();
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setNewItem({ name: item.name, price: item.price, category: item.category });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewItem({ name: '', price: '', category: '' });
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await deleteMenuItem(id);
            fetchMenu();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Menu Management</h2>

            <form onSubmit={handleDataSubmit} className="mb-8 p-4 border rounded shadow-md bg-white">
                <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Beverages">Beverages</option>
                    </select>
                </div>
                <div className="mt-4 flex gap-2">
                    <button type="submit" className={`px-4 py-2 rounded text-white ${editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}>
                        {editingId ? 'Update Item' : 'Add Item'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded shadow-sm flex justify-between items-center bg-white">
                        <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-gray-600">₹{item.price}</p>
                            <span className="text-sm bg-gray-200 px-2 py-1 rounded">{item.category}</span>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEditClick(item)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
