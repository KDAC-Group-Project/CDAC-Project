import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { addBooking } from '../../store/slices/bookingsSlice';
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

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const tour = useSelector((state) => 
    state.tours.tours.find(t => t.id === id)
  );
  
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item.id === id);

  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);

  if (!tour) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Tour not found</h2>
        <button
          onClick={() => navigate('/user/tours')}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Tours
        </button>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist({
        id: tour.id,
        title: tour.title,
        price: tour.price,
        image: tour.image,
        destination: tour.destination,
        duration: tour.duration
      }));
    } else {
      dispatch(addToWishlist({
        id: tour.id,
        title: tour.title,
        price: tour.price,
        image: tour.image,
        destination: tour.destination,
        duration: tour.duration
      }));
    }
  };

  const handleBookNow = () => {
    if (!selectedDate) return;
    const today = new Date();
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + tour.duration);
    const booking = {
      id: Date.now().toString(),
      userId: 'user1', // Replace with actual user id from auth context if available
      tourId: tour.id,
      tourTitle: tour.title,
      tourImage: tour.image,
      destination: tour.destination,
      userEmail: 'demo@example.com', // Replace with actual user email from auth context if available
      userName: 'Demo User', // Replace with actual user name from auth context if available
      bookingDate: today.toISOString().split('T')[0],
      travelDate: selectedDate,
      endDate: endDate.toISOString().split('T')[0],
      guests: guests,
      totalAmount: tour.price * guests,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      createdAt: today.toISOString()
    };
    dispatch(addBooking(booking));
    if (isInWishlist) {
      dispatch(removeFromWishlist({
        id: tour.id,
        title: tour.title,
        price: tour.price,
        image: tour.image,
        destination: tour.destination,
        duration: tour.duration
      }));
    }
    alert('Booking added! Check My Bookings page.');
    setSelectedDate('');
    setGuests(1);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'difficult': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPrice = tour.price * guests;

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
            src={tour.image}
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
                  {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
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
                  {tour.includes.map((item, index) => (
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