'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { apiJson } from '@/lib/api';

export default function ManageServices() {
  const { data: session } = authClient.useSession();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 কাস্টম মডাল স্টেট
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, serviceId: null });

  // সার্ভিস লোড করা
  const fetchServices = async () => {
    try {
      if (!session?.user?.email) return;
      
      const data = await apiJson('/api/admin/services', {
        headers: { 'Authorization': `Bearer ${session.user.email}` }
      });
      setServices(data.data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchServices();
  }, [session]);

  // 👇 ডিলিট বাটনে ক্লিক করলে মডাল ওপেন হবে
  const openDeleteModal = (id) => {
    setDeleteModal({ isOpen: true, serviceId: id });
  };

  // 👇 মডালে "Yes" দিলে আসল ডিলিট এপিআই কল হবে
  const confirmDelete = async () => {
    const id = deleteModal.serviceId;
    setDeleteModal({ isOpen: false, serviceId: null }); // মডাল বন্ধ করা হলো

    try {
      await apiJson(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.user.email}` }
      });
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) return <div className="p-8 text-gray-900 dark:text-white">Loading services...</div>;

  return (
    <div className="p-6 text-gray-900 dark:text-white transition-colors duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Link 
          href="/dashboard/admin/add-service" 
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition font-medium"
        >
          + Add New Service
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-transparent dark:border-gray-700 overflow-x-auto transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <tr>
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Service Name</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Duration</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {services.map((service) => (
              <tr key={service._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="p-4">
                  <img src={service.image} alt={service.serviceName} className="w-12 h-12 rounded object-cover" />
                </td>
                <td className="p-4 font-medium text-gray-900 dark:text-white">{service.serviceName}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{service.category}</td>
                <td className="p-4 text-gray-900 dark:text-white">${service.price}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{service.duration} min</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    service.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  }`}>
                    {service.status}
                  </span>
                </td>
                
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link 
                      href={`/dashboard/admin/manage-services/edit/${service._id}`} 
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    {/* 👇 openDeleteModal কল করা হলো */}
                    <button 
                      onClick={() => openDeleteModal(service._id)} 
                      className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {services.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No services found. Add some!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 👇 কাস্টম ডিলিট কনফার্মেশন মডাল */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Delete Service</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this service? This action cannot be undone.</p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, serviceId: null })} 
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
              >
                No, Keep it
              </button>
              <button 
                onClick={confirmDelete} 
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}