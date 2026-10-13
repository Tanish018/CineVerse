import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom';
import { Film, Search } from 'lucide-react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Theatres from './pages/Theatres';
import TheatreDetails from './pages/TheatreDetails';
import SeatSelection from './pages/SeatSelection';
import BookingSummary from './pages/BookingSummary';
import BookingDetails from './pages/BookingDetails';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Dashboard from './admin/Dashboard';
import AdminMovies from './admin/Movies';
import AdminTheatres from './admin/Theatres';
import AdminScreens from './admin/Screens';
import AdminSeats from './admin/Seats';
import AdminShows from './admin/Shows';
import AdminBookings from './admin/Bookings';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:movieId" element={<MovieDetails />} />
        <Route path="/theatres" element={<Navigate to="/movies" replace />} />
        <Route path="/theatres/:theatreId" element={<Navigate to="/movies" replace />} />
        <Route
          path="/shows/:showId/seats"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/summary"
          element={
            <ProtectedRoute>
              <BookingSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

const NotFound = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
    <div className="max-w-md text-center">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#EF233C]">
        <Search className="w-7 h-7" />
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#EF233C] font-bold mb-3">404 / Scene missing</p>
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">That page is out of frame.</h1>
      <p className="text-sm text-gray-400 leading-relaxed mb-7">The address does not match a MovieVerse destination.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#EF233C] hover:bg-red-600 transition-colors">
        <Film className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  </div>
);

const AdminRoutes = () => (
  <ProtectedRoute adminOnly>
    <AdminLayout />
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="movies" element={<AdminMovies />} />
            <Route path="theatres" element={<AdminTheatres />} />
            <Route path="screens" element={<AdminScreens />} />
            <Route path="seats" element={<AdminSeats />} />
            <Route path="shows" element={<AdminShows />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
          <Route path="*" element={<PublicLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
