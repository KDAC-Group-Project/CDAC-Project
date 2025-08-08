import React, { useState, useContext } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Save,
  Edit,
  Star,
  Plane
} from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { updateUserProfile } from '../../api';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const bookings = useSelector((state) => state.bookings.bookings);
  // Get reviews from localStorage (as MyReviews uses local state)
  const reviews = JSON.parse(localStorage.getItem('myReviews') || '[]');

  // Calculate stats
  const completedTrips = bookings.filter(b => b.status === 'completed').length;
  const countriesVisited = Array.from(new Set(bookings.map(b => b.destination))).length;
  const reviewsGiven = reviews.length;
  const totalSpent = 15750; // This is a placeholder, actual total spent would need to be tracked
  const memberSince = '2023-06-15'; // This is a placeholder, actual member since would need to be tracked
  const favoriteDestination = 'Maldives'; // This is a placeholder, actual favorite destination would need to be tracked

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    dateOfBirth: user?.dateOfBirth || '1990-05-15',
    address: user?.address || '123 Main St, New York, NY 10001',
    bio: user?.bio || 'Travel enthusiast who loves exploring new cultures and destinations.',
    avatar: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  });

  const recentTrips = [
    {
      destination: 'Maldives',
      date: '2024-01-15',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      destination: 'Swiss Alps',
      date: '2023-12-10',
      image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      destination: 'India',
      date: '2023-11-05',
      image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);

    // Prepare payload for backend
    const token = sessionStorage.getItem('token');
    const payload = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phoneNumber: profileData.phone, // Map to phoneNumber
      avatarUrl: profileData.avatar,  // Map to avatarUrl
    };

    try {
      const updatedUser = await updateUserProfile(payload, token);
      setUser(updatedUser); // Update context with backend response
      // Optionally update sessionStorage as well
      sessionStorage.setItem('firstName', updatedUser.firstName);
      sessionStorage.setItem('lastName', updatedUser.lastName);
      sessionStorage.setItem('avatar', updatedUser.avatarUrl);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="flex items-center mb-6">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                {isEditing && (
                  <>
                    <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full hover:bg-emerald-700 cursor-pointer">
                      <Camera className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-gray-600">Travel Explorer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Recent Trips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentTrips.map((trip, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <div className="p-3 text-white">
                      <h4 className="font-medium">{trip.destination}</h4>
                      <p className="text-xs">{formatDate(trip.date)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Travel Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Total Trips</p>
                    <p className="text-xs text-gray-600">Completed bookings</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{completedTrips}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Countries Visited</p>
                    <p className="text-xs text-gray-600">Unique destinations</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{countriesVisited}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Reviews Given</p>
                    <p className="text-xs text-gray-600">Shared experiences</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{reviewsGiven}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                    <p className="text-xs text-gray-600">Join date</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(memberSince)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Travel Achievements</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                <span className="text-sm">Explorer Badge</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">World Traveler</span>
              </div>
              <div className="flex items-center">
                <Plane className="w-4 h-4 mr-2" />
                <span className="text-sm">Frequent Flyer</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm">Total Spent: <span className="font-bold">${totalSpent.toLocaleString()}</span></p>
              <p className="text-sm">Favorite Destination: <span className="font-bold">{favoriteDestination}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;