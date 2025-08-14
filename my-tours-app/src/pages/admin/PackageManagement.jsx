import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { deleteTour, getAllTours } from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Star,
  Filter,
  Search
} from 'lucide-react';
import AddPackage from './AddPackage';
import EditPackage from './EditPackage';
import ViewPackage from './ViewPackage';

const PackageManagement = ({ token }) => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const categories = ['BEACH', 'ADVENTURE', 'CULTURAL', 'WILDLIFE', 'CITY', 'MOUNTAIN', 'CRUISE', 'FOOD'];

  // Fetch tours on component mount
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await getAllTours();
        setTours(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tours:', err);
        setError(err.message || 'Failed to fetch tours');
        toast.error('Failed to fetch tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || tour.category === selectedCategory;
    const matchesStatus = statusFilter === '' || 
                         (statusFilter === 'active' && tour.isActive) ||
                         (statusFilter === 'inactive' && !tour.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteTour = async (tourId) => {
    if (window.confirm('Are you sure you want to delete this tour package?')) {
      try {
        await deleteTour(tourId, token);
        // Remove the deleted tour from local state
        setTours(prevTours => prevTours.filter(tour => tour.id !== tourId));
        toast.success('Tour package deleted successfully');
      } catch (error) {
        console.error('Failed to delete tour:', error);
        toast.error(error.message || 'Failed to delete tour package');
      }
    }
  };

  const PackageList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
        <Link
          to="/admin/packages/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Package
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              {filteredTours.length} packages
            </div>
          </div>
        </div>
      )}

      {/* Tours List */}
      {!loading && !error && filteredTours.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={tour.tourImage || tour.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image'}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tour.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tour.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tour.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
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
                    ${tour.price}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/packages/view/${tour.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                  <Link
                    to={`/admin/packages/edit/${tour.id}`}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteTour(tour.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTours.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory || statusFilter 
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first tour package.'}
          </p>
          <Link
            to="/admin/packages/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Package
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <Routes>
      <Route index element={<PackageList />} />
      <Route path="add" element={<AddPackage token={token} />} />
      <Route path="edit/:id" element={<EditPackage token={token} />} />
      <Route path="view/:id" element={<ViewPackage />} />
    </Routes>
  );
};

export default PackageManagement;