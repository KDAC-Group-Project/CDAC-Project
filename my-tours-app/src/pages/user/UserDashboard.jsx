import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Star, 
  DollarSign,
  Compass,
  Heart,
  CreditCard,
  TrendingUp,
  Clock,
  Users,
  Award
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const tours = useSelector((state) => state.tours.tours);
  const bookings = useSelector((state) => state.bookings.bookings);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  // Get reviews from localStorage (as MyReviews uses local state)
  const reviews = JSON.parse(localStorage.getItem('myReviews') || '[]');

  // Calculate stats
  const totalBookings = bookings.length;
  const countriesVisited = Array.from(new Set(bookings.map(b => b.destination)));
  const reviewsGiven = reviews.length;

  // Get recent bookings (mock data)
  const recentBookings = bookings.slice(0, 3);

  // Get recommended tours based on user preferences
  const recommendedTours = tours.filter(tour => tour.isActive).slice(0, 4);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Placeholders for total spent and member since
  const totalSpent = 4250;
  const memberSince = '2023-06-15';

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
      link: '/user/bookings'
    },
    {
      title: 'Upcoming Trips',
      value: bookings.filter(b => b.status === 'confirmed' && new Date(b.travelDate) > new Date()).length.toString(),
      icon: Clock,
      color: 'bg-emerald-500',
      link: '/user/bookings'
    },
    {
      title: 'Wishlist Items',
      value: wishlistItems.length.toString(),
      icon: Heart,
      color: 'bg-red-500',
      link: '/user/wishlist'
    },
    {
      title: 'Countries Visited',
      value: countriesVisited.length.toString(),
      icon: MapPin,
      color: 'bg-purple-500',
      link: '/user/profile'
    },
    {
      title: 'Reviews Given',
      value: reviewsGiven.toString(),
      icon: Star,
      color: 'bg-yellow-500',
      link: '/user/reviews'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600 mt-1">Ready for your next adventure?</p>
        </div>
        <div className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg">
          <Award className="w-5 h-5 mr-2" />
          <span className="font-medium">Explorer Member</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/user/tours"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Compass className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Browse Tours</h3>
              <p className="text-sm text-gray-600">Discover amazing destinations</p>
            </div>
          </Link>
          
          <Link
            to="/user/bookings"
            className="flex items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <Calendar className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">My Bookings</h3>
              <p className="text-sm text-gray-600">View your travel plans</p>
            </div>
          </Link>
          
          <Link
            to="/user/payments"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <CreditCard className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-600">Track your expenses</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <Link
                to="/user/bookings"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={booking.tourImage}
                      alt={booking.tourTitle}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{booking.tourTitle}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {booking.destination}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.travelDate)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">${booking.totalAmount}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No bookings yet</p>
                <Link
                  to="/user/tours"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Browse tours to get started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Travel Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Travel Journey</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Total Spent</p>
                    <p className="text-xs text-gray-600">Lifetime travel investment</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">${totalSpent}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-emerald-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Reviews Given</p>
                    <p className="text-xs text-gray-600">Help other travelers</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{reviewsGiven}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                    <p className="text-xs text-gray-600">Part of our community</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(memberSince)}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Countries Visited</p>
                <div className="flex flex-wrap gap-2">
                  {countriesVisited.map((country, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Tours */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
            <Link
              to="/user/tours"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All Tours
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedTours.map((tour) => (
              <Link
                key={tour.id}
                to={`/user/tours/${tour.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {tour.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {tour.destination}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-gray-600">{tour.rating}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">${tour.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;