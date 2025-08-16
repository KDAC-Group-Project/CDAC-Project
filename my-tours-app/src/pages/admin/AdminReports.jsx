import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { fetchTours } from '../../store/slices/toursSlice';
import { fetchAllBookings, fetchBookingStats } from '../../store/slices/bookingsSlice';
import { fetchAllUsers } from '../../store/slices/usersSlice';
import { exportCSV } from '../../utils/exportCSV';

const AdminReports = () => {
  const dispatch = useDispatch();
  const tours = useSelector((state) => state.tours.tours);
  const bookings = useSelector((state) => state.bookings.bookings);
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.bookings.loading || state.tours.loading || state.users.loading);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    dispatch(fetchTours());
    dispatch(fetchAllBookings());
    dispatch(fetchAllUsers());
    dispatch(fetchBookingStats());
  }, [dispatch]);

  // Generate revenue data from actual bookings
  const generateRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      const monthBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt || booking.bookingDate);
        return bookingDate.getMonth() === monthIndex && (booking.paymentStatus === 'PAID' || booking.paymentStatus === 'paid');
      });
      const monthRevenue = monthBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      const monthBookingsCount = monthBookings.length;
      
      return {
        month,
        revenue: monthRevenue,
        bookings: monthBookingsCount
      };
    });
  };

  const revenueData = generateRevenueData();

  // Category distribution
  const categoryData = tours.reduce((acc, tour) => {
    const existing = acc.find(item => item.name === tour.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: tour.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Top destinations by bookings
  const destinationData = tours.map(tour => ({
    destination: tour.destination,
    bookings: bookings.filter(booking => booking.tourId === tour.id).length,
    revenue: bookings
      .filter(booking => booking.tourId === tour.id && (booking.paymentStatus === 'PAID' || booking.paymentStatus === 'paid'))
      .reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0)
  })).sort((a, b) => b.bookings - a.bookings).slice(0, 8);

  // Generate user growth data from actual user registrations
  const generateUserGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      const monthUsers = users.filter(user => {
        const userDate = new Date(user.createdAt || user.registrationDate);
        return userDate.getMonth() === monthIndex && user.role === 'user';
      });
      
      return {
        month,
        users: monthUsers.length
      };
    });
  };

  const userGrowthData = generateUserGrowthData();

  // Booking status distribution
  const bookingStatusData = [
    { name: 'Confirmed', value: bookings.filter(b => (b.status === 'CONFIRMED' || b.status === 'confirmed')).length, color: '#10B981' },
    { name: 'Pending', value: bookings.filter(b => (b.status === 'PENDING' || b.status === 'pending')).length, color: '#F59E0B' },
    { name: 'Cancelled', value: bookings.filter(b => (b.status === 'CANCELLED' || b.status === 'cancelled')).length, color: '#EF4444' },
    { name: 'Completed', value: bookings.filter(b => (b.status === 'COMPLETED' || b.status === 'completed')).length, color: '#3B82F6' }
  ];

  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'PAID' || booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0);

  const averageBookingValue = totalRevenue / bookings.filter(b => b.paymentStatus === 'paid').length || 0;

  const exportReport = () => {
    const rows = [
      { Metric: 'Total Revenue', Value: `$${totalRevenue.toLocaleString()}` },
      { Metric: 'Total Bookings', Value: bookings.length },
      { Metric: 'Avg Booking Value', Value: `$${Math.round(averageBookingValue)}` },
      { Metric: 'Active Users', Value: users.filter(u => (u.role === 'USER' || u.role === 'user') && u.isActive).length },
      { Metric: 'Total Tours', Value: tours.length },
      { Metric: 'Confirmed Bookings', Value: bookings.filter(b => b.status === 'confirmed').length },
      { Metric: 'Pending Bookings', Value: bookings.filter(b => b.status === 'pending').length },
      { Metric: 'Completed Bookings', Value: bookings.filter(b => b.status === 'completed').length },
      { Metric: 'Cancelled Bookings', Value: bookings.filter(b => b.status === 'cancelled').length },
      ...destinationData.map(d => ({ 
        Metric: `Destination: ${d.destination}`, 
        Value: `${d.bookings} bookings, $${d.revenue.toLocaleString()} revenue` 
      })),
      ...categoryData.map(c => ({ 
        Metric: `Category: ${c.name}`, 
        Value: `${c.value} tours` 
      })),
      ...bookingStatusData.map(s => ({ 
        Metric: `Status: ${s.name}`, 
        Value: s.value 
      })),
    ];
    
    exportCSV(rows, `admin-report-${new Date().toISOString().slice(0,10)}.csv`);
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
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={exportReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+22%</span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+15%</span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {users.filter(u => u.role === 'user' && u.isActive).length}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+8%</span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Booking Value</p>
              <p className="text-3xl font-bold text-gray-900">${Math.round(averageBookingValue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+5%</span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Destinations by Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={destinationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="destination" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Categories Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryData.map((category, index) => (
            <div key={category.name} className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              >
                {category.value}
              </div>
              <p className="text-sm font-medium text-gray-900">{category.name}</p>
              <p className="text-xs text-gray-500">{((category.value / tours.length) * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Revenue
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${Math.round(totalRevenue * 0.82).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +22%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Bookings
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {bookings.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round(bookings.length * 0.87)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +15%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Active Users
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {users.filter(u => u.role === 'user' && u.isActive).length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round(users.filter(u => u.role === 'user' && u.isActive).length * 0.93)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +8%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Conversion Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  3.2%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2.8%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +14%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;