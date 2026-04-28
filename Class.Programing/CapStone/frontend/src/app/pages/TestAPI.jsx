import React, { useState, useEffect } from 'react';
import { getAllBookings, createBooking, deleteBooking } from './api';

function TestAPI() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await getAllBookings();
            setBookings(response.data);
        } catch (error) {
            alert('Backend connection failed!');
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        const testBooking = {
            customerName: "Test User",
            date: new Date().toISOString().split('T')[0],
            seats: 2
        };
        try {
            const response = await createBooking(testBooking);
            setBookings([...bookings, response.data]);
            alert('Created!');
        } catch (error) {
            alert('Create failed');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete?')) {
            await deleteBooking(id);
            setBookings(bookings.filter(b => b.id !== id));
        }
    };

    return (
        <div>
            <h1>Bookings Test</h1>
            <button onClick={handleCreate}>Add Test Booking</button>
            {loading && <p>Loading...</p>}
            {bookings.map(booking => (
                <div key={booking.id}>
                    {booking.customerName} - {booking.date}
                    <button onClick={() => handleDelete(booking.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default TestAPI;