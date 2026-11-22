'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export default function ManageUsers() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${session?.user?.email}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (session) fetchUsers(); }, [session]);

  const toggleBlock = async (id) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}/toggle-block`, {
      method: 'PATCH', headers: { 'Authorization': `Bearer ${session.user.email}` }
    });
    const data = await res.json();
    if (data.success) { toast.success('Status updated'); fetchUsers(); }
  };

  if (loading) return <div className="p-8 text-gray-900 dark:text-white">Loading users...</div>;

  return (
    // 👇 মেইন কন্টেইনারে টেক্সট কালার ডার্ক মোডের জন্য যোগ করা হলো
    <div className="p-6 text-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">Manage Customers</h1>
      
      {/* 👇 টেবিল কন্টেইনার */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-transparent dark:border-gray-700 overflow-x-auto transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          
          {/* 👇 টেবিল হেডার */}
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          
          {/* 👇 টেবিল বডি */}
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 flex items-center gap-3 font-medium">
                  <img src={user.image || '/avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                  {user.name}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                <td className="p-4">
                  {/* 👇 স্ট্যাটাস ব্যাজ */}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    user.isBlocked 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  }`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleBlock(user._id)} 
                    className={`px-3 py-1 rounded-md text-white text-sm font-medium transition-colors ${
                      user.isBlocked 
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' 
                        : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
                    }`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}