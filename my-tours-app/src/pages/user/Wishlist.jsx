import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Clock, 
  DollarSign,
  Trash2,
  Eye
} from 'lucide-react';
import { createBooking } from '../../services/api';
import { fetchWishlistFromBackend, removeFromWishlistBackend, setWishlistItems } from '../../store/slices/wishlistSlice';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlistFromBackend());
    }
  }, [dispatch, token]);

  const handleRemoveFromWishlist = async (tourId) => {
    try {
      await dispatch(removeFromWishlistBackend(tourId)).unwrap();
    } catch (err) {
      // UI will auto-revert via re-fetch in the thunk
      alert(err.message || 'Failed to remove from wishlist');
    }
  };

  const handleBookNow = async (item) => {
    if (!token) {
      alert('Please sign in to book this tour.');
      navigate('/login');
      return;
    }
    try {
      const start = new Date();
      const travelDate = start.toISOString().split('T')[0];
      const end = new Date(start.getTime() + (item.duration || 1) * 24 * 60 * 60 * 1000);
      const endDate = end.toISOString().split('T')[0];
      const totalAmount = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);

      // Ensure the tour is removed from wishlist in DB before booking
      try {
        await dispatch(removeFromWishlistBackend(item.id)).unwrap();
      } catch (removeErr) {
        // Proceed with booking even if removal fails; will re-sync after
        console.warn('Wishlist removal before booking failed:', removeErr);
      }

      await createBooking({
        tourId: item.id,
        travelDate,
        endDate,
        guests: 1,
        totalAmount,
        paymentMethod: 'Credit Card'
      });

      // Optimistically update local wishlist UI without reload
      // Then re-fetch to ensure final consistency
      const remaining = items.filter((i) => String(i.id) !== String(item.id));
      dispatch(setWishlistItems(remaining));
      dispatch(fetchWishlistFromBackend());

      alert('Booking confirmed! The tour has been removed from your wishlist.');
      navigate('/user/bookings');
    } catch (err) {
      alert(err.message || 'Failed to create booking');
    }
  };

  const tourImage = (t) => t.tourImage || t.imageUrl || 'https://via.placeholder.com/640x360?text=Tour+Image';

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading wishlist...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in to view your wishlist</h3>
        <p className="text-gray-600 mb-6">
          You need to be signed in to save and view your favorite tours.
        </p>
        <Link
          to="/login"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <div className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg">
          <Heart className="w-5 h-5 mr-2" />
          <span className="font-medium">{items.length} Saved Tours</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={tourImage(item)}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.destination}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.duration} days
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${item.price}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/user/tours/${item.id}`}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Link>
                  <button
                    onClick={() => handleBookNow(item)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    title="Book this tour"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors flex items-center"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Start exploring our tours and save your favorites for later!
          </p>
          <Link
            to="/user/tours"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;