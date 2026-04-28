import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './app/pages/Home'
import Gallery from './app/pages/Gallery'
import Contact from './app/pages/Contact'
import About from './app/pages/About'
import Login from './app/pages/Login'
import Register from './app/pages/Register'
import BookingList from './app/pages/BookingList'
import CreateBooking from './app/pages/CreateBooking'
import PhotographerDashboard from './app/pages/PhotographerDashboard'
import AdminDashboard from './app/pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/booking" element={<CreateBooking />} />

        {/* Photographer Routes */}
        <Route path="/photographer/dashboard" element={<PhotographerDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App