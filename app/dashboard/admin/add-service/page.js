'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { apiJson, apiUpload } from '@/lib/api';

export default function AddService() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    status: 'active',
    image: '', 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // নতুন ছবি সিলেক্ট করলে প্রিভিউ দেখানোর ফাংশন
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFormData({ ...formData, image: previewUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) return toast.error("Please select an image");
    if (Number(formData.price) <= 0) return toast.error("Price must be positive");
    if (Number(formData.duration) <= 0) return toast.error("Duration must be positive");
    
    setLoading(true);

    try {
      // ১. ছবি ImgBB-তে আপলোড করা
      const imageFormData = new FormData();
      imageFormData.append("image", file);

      const imgData = await apiUpload(imageFormData);
      const imageUrl = imgData.url;

      // ২. সার্ভারে ডাটা পাঠানো
      await apiJson('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.email}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          duration: Number(formData.duration),
          image: imageUrl,
        }),
      });

      toast.success('Service added successfully!');
      router.push('/dashboard/admin/manage-services');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    // 👇 মেইন কন্টেইনার
    <div className="max-w-3xl mx-auto p-6 min-h-screen transition-colors duration-300">
      
      {/* 👇 ফর্ম কার্ড */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Salon Service</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Service Name</label>
              <input 
                type="text" 
                name="serviceName" 
                required 
                onChange={handleChange} 
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors" 
                placeholder="e.g., Premium Haircut" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
              <select 
                name="category" 
                required 
                onChange={handleChange} 
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors"
              >
                <option value="">Select Category</option>
                <option value="Haircut & Styling">Haircut & Styling</option>
                <option value="Hair Coloring">Hair Coloring</option>
                <option value="Facial & Skincare">Facial & Skincare</option>
                <option value="Makeup">Makeup</option>
                <option value="Manicure & Pedicure">Manicure & Pedicure</option>
                <option value="Spa & Massage">Spa & Massage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
            <textarea 
              name="description" 
              required 
              onChange={handleChange} 
              rows="3" 
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Price ($)</label>
              <input 
                type="number" 
                name="price" 
                required 
                min="1" 
                onChange={handleChange} 
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors" 
                placeholder="e.g., 50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Duration (Minutes)</label>
              <input 
                type="number" 
                name="duration" 
                required 
                min="1" 
                onChange={handleChange} 
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors" 
                placeholder="e.g., 60" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Service Image (Upload)</label>
            {formData.image && (
              <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded mb-2 border border-gray-200 dark:border-gray-700" />
            )}
            <input 
              type="file" 
              accept="image/*" 
              required 
              onChange={handleFileChange} 
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-700 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Service Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors mt-4"
          >
            {loading ? 'Adding Service...' : 'Add Service'}
          </button>
        </form>
      </div>
    </div>
  );
}