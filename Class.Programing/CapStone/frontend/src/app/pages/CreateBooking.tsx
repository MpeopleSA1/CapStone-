import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../api';

export default function CreateBooking() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        date: '',
        seats: 1,
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            await createBooking(formData);
            alert('Booking created successfully!');
            navigate('/bookings');
        } catch (err: any) {
            console.error('Error creating booking:', err);
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-card border border-primary/20 rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-2">Create New Booking</h1>
                <p className="text-gray-400 mb-6">Fill in the details below to create a new photography booking</p>

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
                            placeholder="Enter customer name"
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
                            placeholder="Number of people"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium mb-2">
                            Special Notes (Optional)
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
                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                'Create Booking'
                            )}
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