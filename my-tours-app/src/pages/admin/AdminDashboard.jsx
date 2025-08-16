import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  Package, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import { fetchTours } from '../../store/slices/toursSlice';
import { fetchAllBookings, fetchBookingStats } from '../../store/slices/bookingsSlice';
import { fetchAllUsers } from '../../store/slices/usersSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const tours = useSelector((state) => state.tours.tours);
  const bookings = useSelector((state) => state.bookings.bookings);
  const users = useSelector((state) => state.users.users);
  const totalRevenue = useSelector((state) => state.bookings.stats?.totalRevenue || 0);
  const loading = useSelector((state) => state.bookings.loading || state.tours.loading || state.users.loading);

  useEffect(() => {
    dispatch(fetchTours());
    dispatch(fetchAllBookings());
    dispatch(fetchAllUsers());
    dispatch(fetchBookingStats());
  }, [dispatch]);

  const activePackages = tours.filter(tour => tour.isActive).length;
  const totalUsers = users.filter(user => user.role === 'user').length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;

  // Recent bookings for the table
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.bookingDate).getTime() - new Date(a.createdAt || a.bookingDate).getTime())
    .slice(0, 5);

  // Popular tours based on bookings
  const tourBookingCounts = tours.map(tour => ({
    ...tour,
    bookingCount: bookings.filter(booking => booking.tourId === tour.id).length
  })).sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Packages',
      value: activePackages.toString(),
      icon: Package,
      color: 'bg-emerald-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+22%',
      changeType: 'positive'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
          <TrendingUp className="w-5 h-5 mr-2" />
          <span className="font-medium">Analytics Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.userName || booking.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{booking.userEmail || booking.user?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.tourTitle || booking.tour?.title || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.destination || booking.tour?.destination || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.totalAmount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Tours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Popular Tours</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tourBookingCounts.map((tour, index) => (
                <div key={tour.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{tour.title}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {tour.destination}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{tour.bookingCount} bookings</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {tour.rating || 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;