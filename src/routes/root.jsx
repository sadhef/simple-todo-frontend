import React from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function Root() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Todo App</h1>
                    <nav>
                        {isLoggedIn ? (
                            <>
                                <Link to="/" className="mr-4">Home</Link>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="mr-4">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-gray-200 p-4 text-center">
                <p>&copy; 2024 Todo App. All rights reserved.</p>
            </footer>
        </div>
    );
}