import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookingById, updateBooking } from '../../api';

export default function EditBooking() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        customerName: '',
        date: '',
        seats: 1,
        status: 'PENDING',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const fetchBooking = async () => {
        try {
            const response = await getBookingById(Number(id));
            const booking = response.data;
            setFormData({
                customerName: booking.customerName,
                date: booking.date,
                seats: booking.seats,
                status: booking.status,
                notes: booking.notes || ''
            });
        } catch (err: any) {
            console.error('Error fetching booking:', err);
            setError('Failed to load booking');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await updateBooking(Number(id), formData);
            alert('Booking updated successfully!');
            navigate('/bookings');
        } catch (err: any) {
            console.error('Error updating booking:', err);
            setError(err.response?.data?.message || 'Failed to update booking');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-400">Loading booking...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-card border border-primary/20 rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-2">Edit Booking</h1>
                <p className="text-gray-400 mb-6">Update the booking details below</p>

                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium mb-2">
                            Customer Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full bg-input-background border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-2">
                            Booking Date <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-input-background border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="seats" className="block text-sm font-medium mb-2">
                            Number of Seats <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            id="seats"
                            name="seats"
                            value={formData.seats}
                            onChange={handleChange}
                            min="1"
                            max="20"
                            className="w-full bg-input-background border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-input-background border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium mb-2">
                            Special Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-input-background border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white resize-none"
                            placeholder="Any special requests or notes for the photographer..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Booking'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/bookings')}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}