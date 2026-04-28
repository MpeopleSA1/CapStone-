import { useState } from 'react';
import { createBooking } from '../api';
import { useNavigate } from 'react-router';

export default function Booking() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        date: '',
        seats: 1
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'seats' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createBooking(formData);
            alert('Booking created successfully!');
            navigate('/bookings');
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Book a Session</h1>

                <form onSubmit={handleSubmit} className="bg-card border border-primary/20 rounded-lg p-8 space-y-6">
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                            className="w-full bg-input-background border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-2">
                            Preferred Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-input-background border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="seats" className="block text-sm font-medium mb-2">
                            Number of Seats
                        </label>
                        <select
                            id="seats"
                            name="seats"
                            value={formData.seats}
                            onChange={handleChange}
                            className="w-full bg-input-background border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                        >
                            {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'Seat' : 'Seats'}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                    >
                        {loading ? 'Creating Booking...' : 'Create Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}