import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../store/slices/wishlistSlice';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Clock, 
  DollarSign,
  Trash2,
  Eye
} from 'lucide-react';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleRemoveFromWishlist = (item) => {
    dispatch(removeFromWishlist(item));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <div className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg">
          <Heart className="w-5 h-5 mr-2" />
          <span className="font-medium">{wishlistItems.length} Saved Tours</span>
        </div>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item)}
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
                    onClick={() => handleRemoveFromWishlist(item)}
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