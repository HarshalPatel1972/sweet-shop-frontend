import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api';

interface Sweet {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  createdAt: string;
}

export function DashboardPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchName) params.name = searchName;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await apiClient.get('/sweets/search', { params });
      setSweets(response.data);
    } catch (error) {
      console.error('Failed to fetch sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSweets();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">🍰 Sweet Shop</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.email} <span className="font-semibold text-purple-600">({user?.role})</span>
            </span>
            {user?.role === 'Admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Search & Filter Sweets</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sweet Name</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search by name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="999.99"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Sweets Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No sweets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <div key={sweet.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
                onClick={() => navigate(`/sweet/${sweet.id}`)}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{sweet.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{sweet.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">${sweet.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">per unit</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {sweet.quantity}
                      </p>
                      <p className="text-sm text-gray-500">in stock</p>
                    </div>
                  </div>

                  {user?.role === 'Admin' && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sweet/${sweet.id}/edit`);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/restock/${sweet.id}`);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm"
                      >
                        Restock
                      </button>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/purchase/${sweet.id}`);
                    }}
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
