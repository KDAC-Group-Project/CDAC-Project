import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  Filter,
  Search,
  Eye
} from 'lucide-react';
import { removeBooking } from '../../store/slices/bookingsSlice';

const MyBookings = () => {
  const bookings = useSelector((state) => state.bookings.bookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const dispatch = useDispatch();

  const handleRemoveBooking = (id) => {
    if(window.confirm('Are you sure you want to remove this booking?')) {
      dispatch(removeBooking(id));
    }
  };

  // Filter bookings for current user (in a real app, this would be based on user ID)
  const userBookings = bookings.filter(booking => {
    const matchesSearch = booking.tourTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const upcomingBookings = userBookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.travelDate) > new Date()
  );

  const pastBookings = userBookings.filter(booking => 
    booking.status === 'completed' || new Date(booking.travelDate) < new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <div className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg">
          <Calendar className="w-5 h-5 mr-2" />
          <span className="font-medium">{userBookings.length} Total Bookings</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Trips</p>
              <p className="text-2xl font-bold text-gray-900">{pastBookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {userBookings.length} bookings found
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {userBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={booking.tourImage}
                    alt={booking.tourTitle}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {booking.tourTitle}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.destination}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(booking.travelDate)} - {formatDate(booking.endDate)}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {booking.guests} guests
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    ${booking.totalAmount}
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Booked on {formatDate(booking.bookingDate)}
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    View Details
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                    onClick={() => handleRemoveBooking(booking.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {userBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter 
              ? 'Try adjusting your filters to see more results.'
              : "You haven't made any bookings yet."}
          </p>
          {!searchQuery && !statusFilter && (
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg">
              Browse Tours
            </button>
          )}
        </div>
      )}
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedBooking(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <img src={selectedBooking.tourImage} alt={selectedBooking.tourTitle} className="w-full h-40 object-cover rounded-lg mb-4" />
            <div className="mb-2"><strong>Tour:</strong> {selectedBooking.tourTitle}</div>
            <div className="mb-2"><strong>Destination:</strong> {selectedBooking.destination}</div>
            <div className="mb-2"><strong>Guests:</strong> {selectedBooking.guests}</div>
            <div className="mb-2"><strong>Travel Dates:</strong> {formatDate(selectedBooking.travelDate)} - {formatDate(selectedBooking.endDate)}</div>
            <div className="mb-2"><strong>Status:</strong> {getStatusBadge(selectedBooking.status)}</div>
            <div className="mb-2"><strong>Total Amount:</strong> ${selectedBooking.totalAmount}</div>
            <div className="mb-2"><strong>Booked On:</strong> {formatDate(selectedBooking.bookingDate)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;