import { useState, useEffect } from 'react';
import { Users, Camera, Calendar, DollarSign, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../api';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalImages: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, bookingsRes] = await Promise.all([
                api.get('/users'),
                api.get('/bookings/all')
            ]);
            setUsers(usersRes.data);
            setBookings(bookingsRes.data);
            setStats({
                totalUsers: usersRes.data.length,
                totalBookings: bookingsRes.data.length,
                totalImages: 0,
                revenue: bookingsRes.data.reduce((total: number, b: any) =>
                    b.status === 'COMPLETED' ? total + (b.seats * 100) : total, 0)
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (confirm('Delete this user?')) {
            await api.delete(`/users/${id}`);
            fetchData();
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        await api.put(`/bookings/${id}/status`, { status });
        fetchData();
    };

    if (loading) return <div className="min-h-screen bg-gray-900"><Navbar /><div className="text-white text-center pt-32">Loading...</div></div>;

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <Users className="w-8 h-8 text-primary mb-2" />
                            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                            <div className="text-gray-400">Total Users</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6">
                            <Calendar className="w-8 h-8 text-primary mb-2" />
                            <div className="text-2xl font-bold text-white">{stats.totalBookings}</div>
                            <div className="text-gray-400">Total Bookings</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6">
                            <DollarSign className="w-8 h-8 text-primary mb-2" />
                            <div className="text-2xl font-bold text-white">${stats.revenue}</div>
                            <div className="text-gray-400">Revenue</div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
                        <h2 className="text-xl font-bold text-white p-6 border-b border-gray-700">Users</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr><th className="px-6 py-3 text-left text-white">Name</th><th className="px-6 py-3 text-left text-white">Email</th><th className="px-6 py-3 text-left text-white">Role</th><th className="px-6 py-3 text-left text-white">Actions</th></tr>
                                </thead>
                                <tbody>
                                    {users.map((user: any) => (
                                        <tr key={user.id} className="border-t border-gray-700">
                                            <td className="px-6 py-3 text-white">{user.name}</td>
                                            <td className="px-6 py-3 text-gray-300">{user.email}</td>
                                            <td className="px-6 py-3"><span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">{user.role}</span></td>
                                            <td className="px-6 py-3"><button onClick={() => handleDeleteUser(user.id)} className="text-red-500"><Trash2 className="w-5 h-5" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <h2 className="text-xl font-bold text-white p-6 border-b border-gray-700">Bookings</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr><th className="px-6 py-3 text-left text-white">Customer</th><th className="px-6 py-3 text-left text-white">Date</th><th className="px-6 py-3 text-left text-white">Seats</th><th className="px-6 py-3 text-left text-white">Status</th><th className="px-6 py-3 text-left text-white">Actions</th></tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking: any) => (
                                        <tr key={booking.id} className="border-t border-gray-700">
                                            <td className="px-6 py-3 text-white">{booking.customerName}</td>
                                            <td className="px-6 py-3 text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-gray-300">{booking.seats}</td>
                                            <td className="px-6 py-3"><span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-200">{booking.status}</span></td>
                                            <td className="px-6 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')} className="text-green-500"><CheckCircle className="w-5 h-5" /></button>
                                                    <button onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')} className="text-red-500"><XCircle className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}