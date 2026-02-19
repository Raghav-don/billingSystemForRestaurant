import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Billing from './pages/Billing';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-orange-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">South Indian Delights</h1>
            <div className="space-x-4">
              <Link to="/menu" className="hover:text-orange-200">Menu</Link>
              <Link to="/orders" className="hover:text-orange-200">Orders</Link>
              <Link to="/billing" className="hover:text-orange-200">Billing</Link>
            </div>
          </div>
        </nav>

        <main className="py-8">
          <Routes>
            <Route path="/menu" element={<Menu />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/" element={<Menu />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
