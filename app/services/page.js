'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function BrowseServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  
  // 👇 সার্চ, ক্যাটাগরি এবং সর্টিং স্টেট
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/services')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setServices(res.data);
          setFilteredServices(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  // 👇 সার্চ, ক্যাটাগরি এবং সর্টিং একসাথে হ্যান্ডেল করার লজিক
  useEffect(() => {
    let result = services;

    // ১. Search by Name
    if (searchTerm) {
      result = result.filter((s) => 
        s.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ২. Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // ৩. Sort by Price
    if (sortOrder === 'low-to-high') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-to-low') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    setFilteredServices(result);
  }, [searchTerm, selectedCategory, sortOrder, services]);

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold text-gray-900 dark:text-white">Loading services...</div>;
  }

  const categories = ['All', 'Haircut & Styling', 'Hair Coloring', 'Makeup', 'Facial & Skincare', 'Manicure & Pedicure', 'Spa & Massage'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Browse All Services</h1>
      
      {/* 👇 সার্চ এবং সর্টিং বার */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search services by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none transition-colors"
        >
          <option value="">Sort by Price</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      {/* ক্যাটাগরি ফিল্টার বাটন */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap border transition ${
              selectedCategory === cat 
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No services found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div key={service._id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800 flex flex-col">
              <img 
                src={service.image} 
                alt={service.serviceName} 
                className="h-48 w-full object-cover rounded-xl mb-4" 
              />
              
              <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{service.serviceName}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{service.category}</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{service.description}</p>
              
              <div className="flex justify-between items-center mt-auto border-t border-gray-100 dark:border-gray-700 pt-4">
                <span className="font-bold text-lg text-gray-900 dark:text-white">${service.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{service.duration} min</span>
              </div>
              
              <Link 
                href={`/services/${service._id}`}
                className="block text-center mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition font-medium"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}