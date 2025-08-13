import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlistBackend, removeFromWishlistBackend, fetchWishlistFromBackend, setWishlistItems } from '../../store/slices/wishlistSlice';
import { fetchTours } from '../../store/slices/toursSlice';
import { Link, useNavigate } from 'react-router-dom';
import { createBooking } from '../../services/api';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Heart,
  DollarSign
} from 'lucide-react';

const BrowseTours = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tours, loading, error } = useSelector((state) => state.tours);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistLoading = useSelector((state) => state.wishlist.loading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const token = sessionStorage.getItem('token');

  // Categories must match backend enum values
  const categories = ['BEACH', 'ADVENTURE', 'CULTURAL', 'WILDLIFE', 'CITY', 'MOUNTAIN', 'CRUISE', 'FOOD'];

  useEffect(() => {
    dispatch(fetchTours());
  }, [dispatch]);

  // Fetch wishlist from backend when component mounts
  useEffect(() => {
    if (token) {
      dispatch(fetchWishlistFromBackend());
    }
  }, [dispatch, token]);

  const filteredTours = tours.filter(tour => {
    const title = (tour.title || '').toLowerCase();
    const destination = (tour.destination || '').toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || destination.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || tour.category === selectedCategory;
    const price = typeof tour.price === 'number' ? tour.price : parseFloat(tour.price || 0);
    const matchesPrice = priceRange === '' || 
                        (priceRange === 'low' && price < 500) ||
                        (priceRange === 'medium' && price >= 500 && price < 1000) ||
                        (priceRange === 'high' && price >= 1000);
    const active = tour.isActive !== false; // default to true if undefined
    return matchesSearch && matchesCategory && matchesPrice && active;
  });

  const isInWishlist = (tourId) => {
    return wishlistItems.some(item => item.id === tourId);
  };

  const imageForTour = (tour) => tour.tourImage || tour.imageUrl || 'https://via.placeholder.com/640x360?text=Tour+Image';

  const handleWishlistToggle = async (tour) => {
    if (!token) {
      alert('Please sign in to save tours to your wishlist.');
      navigate('/login');
      return;
    }

    if (isInWishlist(tour.id)) {
      // Remove from wishlist
      try {
        await dispatch(removeFromWishlistBackend(tour.id)).unwrap();
      } catch (err) {
        alert('Failed to remove from wishlist: ' + err.message);
      }
    } else {
      // Add to wishlist
      try {
        await dispatch(addToWishlistBackend(tour)).unwrap();
        alert('Added to wishlist');
      } catch (err) {
        alert('Failed to add to wishlist: ' + (err?.message || 'Unknown error'));
      }
    }
  };

  const handleBookNow = async (tour) => {
    if (!token) {
      alert('Please sign in to book this tour.');
      navigate('/login');
      return;
    }
    const start = new Date();
    const travelDate = start.toISOString().split('T')[0];
    const end = new Date(start.getTime() + (tour.duration || 1) * 24 * 60 * 60 * 1000);
    const endDate = end.toISOString().split('T')[0];

    const payload = {
      tourId: tour.id,
      travelDate,
      endDate,
      guests: 1,
      totalAmount: typeof tour.price === 'number' ? tour.price : parseFloat(tour.price || 0),
      paymentMethod: 'Credit Card'
    };

    try {
      // Remove from wishlist in DB first, then book
      try {
        await dispatch(removeFromWishlistBackend(tour.id)).unwrap();
      } catch (removeErr) {
        console.warn('Wishlist removal before booking failed:', removeErr);
      }

      await createBooking(payload);

      // Optimistically update local wishlist immediately after booking
      const remaining = wishlistItems.filter((i) => String(i.id) !== String(tour.id));
      dispatch(setWishlistItems(remaining));
      // Then re-fetch to ensure final consistency
      dispatch(fetchWishlistFromBackend());

      alert('Booking confirmed!');
      navigate('/user/bookings');
    } catch (err) {
      alert(err.message || 'Failed to create booking');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const d = (difficulty || '').toString();
    switch (d) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'DIFFICULT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLabel = (text) => {
    if (!text) return '';
    const s = text.toString();
    return s.charAt(0) + s.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tours</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Browse Tours</h1>
        <div className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg">
          <MapPin className="w-5 h-5 mr-2" />
          <span className="font-medium">{filteredTours.length} Tours Available</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{formatLabel(category)}</option>
            ))}
          </select>
          
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Prices</option>
            <option value="low">Under $500</option>
            <option value="medium">$500 - $1000</option>
            <option value="high">Over $1000</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredTours.length} results
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group">
            <div className="relative">
              <img
                src={imageForTour(tour)}
                alt={tour.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => handleWishlistToggle(tour)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isInWishlist(tour.id) 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(tour.id) ? 'fill-current' : ''}`} />
              </button>
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {formatLabel(tour.category)}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
                  {formatLabel(tour.difficulty)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {tour.title}
              </h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {tour.destination}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {tour.duration} days
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  Max {tour.maxGroupSize}
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  {tour.rating || 0} ({tour.reviewCount || 0})
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${typeof tour.price === 'number' ? tour.price : parseFloat(tour.price || 0)}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {tour.description}
              </p>
              
              <div className="flex space-x-2">
                <Link
                  to={`/user/tours/${tour.id}`}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleWishlistToggle(tour)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isInWishlist(tour.id)
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isInWishlist(tour.id) ? 'Remove' : 'Save'}
                </button>
                <button
                  onClick={() => handleBookNow(tour)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTours.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory || priceRange 
              ? 'Try adjusting your filters to see more results.'
              : 'Tours will appear here once they are available.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BrowseTours;