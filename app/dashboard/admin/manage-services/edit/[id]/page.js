'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { apiJson, apiUpload } from '@/lib/api';

export default function EditService() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: '', category: '', description: '', price: '', duration: '', image: '', status: 'active'
  });

  const serviceId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    apiJson(`/api/services/${serviceId}`)
      .then(data => setFormData(data.data))
      .catch(err => toast.error(err.message || 'Failed to load service'))
      .finally(() => setLoading(false));
  }, [serviceId]);

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
    setSaving(true);

    try {
      let imageUrl = formData.image;

      // যদি নতুন ছবি আপলোড করা হয়
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        const imgData = await apiUpload(imageFormData);
        imageUrl = imgData.url;
        toast.success('Image uploaded successfully!'); 
      }

      await apiJson(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.email}`
        },
        body: JSON.stringify({ ...formData, image: imageUrl })
      });

      toast.success('Service updated successfully!');
      router.push('/dashboard/admin/manage-services');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-900 dark:text-white">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen transition-colors duration-300">
      
      {/* 👇 ফর্ম কার্ড */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
        
        {/* 👇 টাইটেল (নীল রঙ সরিয়ে নরমাল সাদা/কালো করা হয়েছে) */}
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Service</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Service Name</label>
            <input 
              type="text" 
              name="serviceName" 
              value={formData.serviceName} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors"
            >
              <option value="Haircut & Styling">Haircut & Styling</option>
              <option value="Hair Coloring">Hair Coloring</option>
              <option value="Facial & Skincare">Facial & Skincare</option>
              <option value="Makeup">Makeup</option>
              <option value="Manicure & Pedicure">Manicure & Pedicure</option>
              <option value="Spa & Massage">Spa & Massage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3" 
              required 
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Price ($)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Duration (Minutes)</label>
              <input 
                type="number" 
                name="duration" 
                value={formData.duration} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-colors" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Image</label>
            <img src={formData.image} alt="Service" className="w-24 h-24 object-cover rounded mb-2 border border-gray-200 dark:border-gray-700" />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-700 transition-colors" 
            />
            {/* 👇 বাংলা লাইন সরিয়ে ইংরেজি লাইন বসানো হলো */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty if you don't want to change the image.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
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
            disabled={saving} 
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors mt-2"
          >
            {saving ? 'Saving...' : 'Update Service'}
          </button>
        </form>
      </div>
    </div>
  );
}