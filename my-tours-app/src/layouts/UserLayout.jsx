import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { 
  Compass, 
  Calendar, 
  CreditCard, 
  Star, 
  User, 
  Info, 
  Mail, 
  LogOut,
  Menu,
  X,
  Home,
  Heart,
  MapPin
} from 'lucide-react';
import { useState } from 'react';

// User Pages
import UserDashboard from '../pages/user/UserDashboard';
import BrowseTours from '../pages/user/BrowseTours';
import MyBookings from '../pages/user/MyBookings';
import PaymentHistory from '../pages/user/PaymentHistory';
import MyReviews from '../pages/user/MyReviews';
import UserProfile from '../pages/user/UserProfile';
import AboutUs from '../pages/user/AboutUs';
import ContactUs from '../pages/user/ContactUs';
import Wishlist from '../pages/user/Wishlist';
import TourDetails from '../pages/user/TourDetails';

const UserLayout = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const token = sessionStorage.getItem('token');

  const onLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  };

  const menuItems = [
    { path: '/user', icon: Home, label: 'Dashboard', exact: true },
    { path: '/user/tours', icon: Compass, label: 'Browse Tours' },
    { path: '/user/bookings', icon: Calendar, label: 'My Bookings' },
    { path: '/user/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistItems.length },
    { path: '/user/payments', icon: CreditCard, label: 'Payment History' },
    { path: '/user/reviews', icon: Star, label: 'My Reviews' },
    { path: '/user/profile', icon: User, label: 'Profile' },
    { path: '/user/about', icon: Info, label: 'About Us' },
    { path: '/user/contact', icon: Mail, label: 'Contact Us' }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-emerald-600 text-white">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 mr-2" />
            <h1 className="text-lg font-bold">Tours & Travels</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome, {user?.firstName}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                <Compass className="w-4 h-4 mr-2" />
                Explorer
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<UserDashboard />} />
            <Route path="tours" element={<BrowseTours />} />
            <Route path="tours/:id" element={<TourDetails />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="reviews" element={<MyReviews />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;