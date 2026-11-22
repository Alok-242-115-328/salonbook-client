'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export default function CustomerProfile() {
  const { data: session, refetch } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', image: '' });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        image: session.user.image || '',
      });
    }
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.email}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Profile updated successfully!');
        if (refetch) refetch(); 
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center gap-6 mb-8">
          <img 
            src={formData.image || 'https://via.placeholder.com/100'} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700" 
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{formData.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{session?.user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-xs font-bold rounded-full uppercase transition-colors">
              {session?.user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              /* 👇 এখানে text-gray-900 এবং dark:text-white নিশ্চিত করা হয়েছে */
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image URL</label>
            <input 
              type="url" 
              value={formData.image} 
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              /* 👇 এখানে text-gray-900 এবং dark:text-white নিশ্চিত করা হয়েছে */
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors" 
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Paste an image URL from ImgBB or any other source.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}