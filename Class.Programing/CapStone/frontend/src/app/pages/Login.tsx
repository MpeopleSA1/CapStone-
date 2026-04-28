import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import api from '../../api';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, userId, email: userEmail, name, role } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userName', name);
            localStorage.setItem('userRole', role);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (role === 'ADMIN') {
                navigate('/admin');
            } else if (role === 'PHOTOGRAPHER') {
                navigate('/photographer/dashboard');
            } else {
                navigate('/bookings');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg p-8">
                {/* Home Button */}
                <div className="mb-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <h1 className="text-2xl font-bold text-center text-white mb-2">Welcome Back</h1>
                <p className="text-gray-400 text-center mb-6">Login to your account</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-primary"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-primary"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded transition-all"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-4 text-sm">
                    Don't have an account? <Link to="/register" className="text-primary hover:text-primary/80">Register</Link>
                </p>
            </div>
        </div>
    );
}