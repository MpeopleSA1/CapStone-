import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { getUserBookings, deleteBooking } from '../../api';

interface Booking {
    id: number;
    customerName: string;
    date: string;
    seats: number;
    status: string;
    notes: string;
}

export default function BookingList() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const response = await getUserBookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            await deleteBooking(id);
            loadBookings();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'text-green-500 bg-green-500/10';
            case 'PENDING': return 'text-yellow-500 bg-yellow-500/10';
            case 'COMPLETED': return 'text-blue-500 bg-blue-500/10';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-white text-xl">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-white">My Bookings</h1>
                        <Link
                            to="/booking"
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-all"
                        >
                            New Booking
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No bookings yet.</p>
                            <Link to="/booking" className="text-primary hover:text-primary/80 mt-2 inline-block">
                                Create your first booking
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-semibold text-white">{booking.customerName}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="flex gap-6 text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>{booking.seats} seats</span>
                                                </div>
                                            </div>
                                            {booking.notes && (
                                                <p className="text-gray-400 text-sm">{booking.notes}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(booking.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}