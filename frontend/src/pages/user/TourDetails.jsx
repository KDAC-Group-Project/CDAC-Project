import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlistBackend, removeFromWishlistBackend, fetchWishlistFromBackend } from '../../store/slices/wishlistSlice';
import { fetchTourById } from '../../store/slices/toursSlice';
import { fetchCurrentUserBookings } from '../../store/slices/bookingsSlice';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Heart,
  Calendar,
  Shield,
  DollarSign,
  Check
} from 'lucide-react';
import { createBooking } from '../../services/api';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { tours, currentTour, loading: toursLoading, error: toursError } = useSelector((state) => state.tours);
  const reduxTour = tours.find(t => String(t.id) === String(id));
  
  const [tour, setTour] = useState(reduxTour || currentTour || null);
  const [loading, setLoading] = useState(!(reduxTour || currentTour));
  const [error, setError] = useState(null);
  
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => String(item.id) === String(id));

  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (reduxTour || currentTour) {
      setTour(reduxTour || currentTour);
      setLoading(false);
      return;
    }
    // Fetch tour from backend if not in Redux store
    dispatch(fetchTourById(id));
  }, [id, reduxTour, currentTour, dispatch]);

  // Fetch wishlist from backend when component mounts
  useEffect(() => {
    if (token) {
      dispatch(fetchWishlistFromBackend());
    }
  }, [dispatch, token]);

  // Watch for tour updates in Redux store
  useEffect(() => {
    const updatedFromList = tours.find(t => String(t.id) === String(id));
    const updated = updatedFromList || currentTour;
    if (updated && updated !== tour) {
      setTour(updated);
      setLoading(false);
    }
  }, [tours, currentTour, id, tour]);

  const tourImage = (t) => (t?.tourImage || t?.imageUrl || t?.image || 'https://via.placeholder.com/960x480?text=Tour');

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tour...</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">{error || 'Tour not found'}</h2>
        <button
          onClick={() => navigate('/user/tours')}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Tours
        </button>
      </div>
    );
  }

  const handleWishlistToggle = async () => {
    if (!token) {
      alert('Please sign in to save tours to your wishlist.');
      navigate('/login');
      return;
    }

    if (isInWishlist) {
      try {
        await dispatch(removeFromWishlistBackend(tour.id)).unwrap();
        alert('Removed from wishlist');
      } catch (err) {
        alert('Failed to remove from wishlist: ' + (err?.message || 'Unknown error'));
      }
    } else {
      try {
        await dispatch(addToWishlistBackend(tour)).unwrap();
        alert('Added to wishlist');
      } catch (err) {
        alert('Failed to add to wishlist: ' + (err?.message || 'Unknown error'));
      }
    }
  };

  const handleBookNow = async () => {
    if (!selectedDate) return;
    if (!token) {
      alert('Please sign in to book this tour.');
      navigate('/login');
      return;
    }

    const startDate = new Date(selectedDate);
    const end = new Date(startDate);
    end.setDate(end.getDate() + (tour.duration || 1));

    const bookingPayload = {
      tourId: tour.id,
      travelDate: selectedDate,
      endDate: end.toISOString().split('T')[0],
      guests: guests,
      totalAmount: (Number(tour.price) || 0) * guests,
      paymentMethod: 'Credit Card'
    };

    try {
      // Remove from wishlist in DB first (if present), then create booking
      if (isInWishlist) {
        try {
          await dispatch(removeFromWishlistBackend(tour.id)).unwrap();
        } catch (wishlistErr) {
          console.warn('Wishlist removal before booking failed:', wishlistErr);
        }
      }

      await createBooking(bookingPayload);

      // Optimistically update wishlist locally so UI reflects change immediately
      const currentItems = (await import('../../store/slices/wishlistSlice')).default; // no-op to satisfy linter
      // We cannot read store here directly; dispatch an action to remove locally, then re-fetch
      dispatch({ type: 'wishlist/setWishlistItems', payload: (prev => prev) }); // placeholder no-op
      dispatch(fetchWishlistFromBackend());
      
      // Refresh user bookings
      dispatch(fetchCurrentUserBookings());
      
      alert('Booking confirmed! Check My Bookings page.');
      setSelectedDate('');
      setGuests(1);
      navigate('/user/bookings');
    } catch (err) {
      alert(err.message || 'Failed to create booking');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const d = (difficulty || '').toString().toUpperCase();
    switch (d) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'DIFFICULT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPrice = (Number(tour.price) || 0) * guests;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/user/tours')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Tour Details</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {/* Header Image */}
        <div className="relative h-64 md:h-80">
          <img
            src={tourImage(tour)}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center space-x-4 mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  {tour.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tour.difficulty)}`}>
                  {tour.difficulty?.charAt(0).toUpperCase() + tour.difficulty?.slice(1)}
                </span>
              </div>
              <h2 className="text-3xl font-bold">{tour.title}</h2>
              <div className="flex items-center mt-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{tour.destination}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-6 right-6 p-3 rounded-full transition-colors ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {tour.duration} days
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Max {tour.maxGroupSize} people
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  {tour.rating} ({tour.reviewCount} reviews)
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Tour</h3>
                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tour.includes?.map((item, index) => (
                    <div key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-emerald-600">${tour.price}</span>
                  <span className="text-gray-600">per person</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {Array.from({ length: tour.maxGroupSize }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">${tour.price} × {guests} guests</span>
                      <span className="font-medium">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-emerald-600">${totalPrice}</span>
                    </div>
                  </div>

                  <button
                    disabled={!selectedDate}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </button>

                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-1" />
                    Free cancellation up to 24 hours before
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;