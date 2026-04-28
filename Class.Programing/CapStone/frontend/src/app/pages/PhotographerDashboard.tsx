import { useState, useEffect } from 'react';
import {
    Upload, X, Trash2, Calendar, Users, CheckCircle, Clock, Image as ImageIcon
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../api';

interface Booking {
    id: number;
    customerName: string;
    date: string;
    seats: number;
    status: string;
    notes: string;
    user: { name: string; email: string };
}

interface Image {
    id: number;
    originalName: string;
    url: string;
    category: string;
}

export default function PhotographerDashboard() {
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [category, setCategory] = useState('');
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'bookings') {
                const response = await api.get('/photographer/bookings');
                setBookings(response.data);
            } else if (activeTab === 'images') {
                const response = await api.get('/photographer/images');
                setImages(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert('Please select files to upload');
            return;
        }
        if (!category) {
            alert('Please select a category');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('images', file));
        formData.append('category', category);

        try {
            await api.post('/photographer/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Images uploaded successfully!');
            setSelectedFiles([]);
            setPreviewUrls([]);
            setCategory('');
            fetchData();
        } catch (error) {
            alert('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        if (window.confirm('Delete this image?')) {
            await api.delete(`/photographer/images/${imageId}`);
            fetchData();
        }
    };

    const handleUpdateStatus = async (bookingId: number, status: string) => {
        try {
            await api.put(`/bookings/${bookingId}/status`, { status });
            fetchData();
            alert(`Booking ${status.toLowerCase()} successfully`);
        } catch (error) {
            alert('Failed to update status');
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

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Photographer Dashboard</h1>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 border-b border-gray-700">
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-6 py-3 font-medium transition-all ${activeTab === 'bookings'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            My Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab('images')}
                            className={`px-6 py-3 font-medium transition-all ${activeTab === 'images'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            My Images
                        </button>
                    </div>

                    {/* Bookings Tab */}
                    {activeTab === 'bookings' && (
                        loading ? (
                            <div className="text-center text-white py-12">Loading bookings...</div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center text-gray-400 py-12">No bookings yet</div>
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
                                                {booking.notes && <p className="text-gray-400">{booking.notes}</p>}
                                            </div>
                                            <div className="flex gap-2">
                                                {booking.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                {booking.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* Images Tab */}
                    {activeTab === 'images' && (
                        <>
                            {/* Upload Section */}
                            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Upload New Images</h2>
                                <div className="mb-4">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Plating">Plating</option>
                                        <option value="Restaurant">Restaurant</option>
                                        <option value="Desserts">Desserts</option>
                                        <option value="Beverages">Beverages</option>
                                    </select>
                                </div>
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                                    <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
                                    <label htmlFor="file-upload" className="cursor-pointer bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        Select Images
                                    </label>
                                </div>
                                {previewUrls.length > 0 && (
                                    <div className="mt-6">
                                        <div className="grid grid-cols-4 gap-4">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <img src={url} className="w-full h-32 object-cover rounded" />
                                                    <button onClick={() => {
                                                        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                                        setPreviewUrls(previewUrls.filter((_, i) => i !== index));
                                                    }} className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={handleUpload} disabled={uploading} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                                            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Images`}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Images Gallery */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {images.map((image) => (
                                    <div key={image.id} className="bg-gray-800 rounded-lg overflow-hidden group">
                                        <div className="relative aspect-square">
                                            <img src={image.url} className="w-full h-full object-cover" />
                                            <button onClick={() => handleDeleteImage(image.id)} className="absolute top-2 right-2 bg-red-600 p-2 rounded opacity-0 group-hover:opacity-100 transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm text-gray-300 truncate">{image.originalName}</p>
                                            <p className="text-xs text-gray-500">{image.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}