import { Link, useNavigate } from 'react-router-dom';
import { Camera, LogOut, Home, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (userRole === 'ADMIN') return '/admin';
        if (userRole === 'PHOTOGRAPHER') return '/photographer/dashboard';
        return '/bookings';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Camera className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold text-white">PhotoBooking</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-white transition flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <Link to="/gallery" className="text-gray-300 hover:text-white transition">Gallery</Link>
                        <Link to="/about" className="text-gray-300 hover:text-white transition">About</Link>
                        <Link to="/contact" className="text-gray-300 hover:text-white transition">Contact</Link>

                        {token && (
                            <Link to={getDashboardLink()} className="text-gray-300 hover:text-white transition flex items-center gap-1">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {token ? (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-300 text-sm hidden md:block">
                                    Welcome, {userName}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 bg-transparent border border-primary hover:bg-primary/20 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}