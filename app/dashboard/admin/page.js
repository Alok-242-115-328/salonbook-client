'use client';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { apiJson } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminOverview() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState({ totalCustomers: 0, activeServices: 0, pendingAppointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!session?.user?.email) return;

        const data = await apiJson('/api/admin/overview', {
          headers: {
            'Authorization': `Bearer ${session.user.email}`
          }
        });
        setStats(data.data);
      } catch (err) {
        toast.error(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session]);

  return (
    // 👇 মেইন কন্টেইনারে টেক্সট কালার ডার্ক মোডের জন্য যোগ করা হলো
    <div className="text-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Welcome back, {session?.user?.name || 'Admin'}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Customers */}
        {/* 👇 কার্ডের ব্যাকগ্রাউন্ড, বর্ডার এবং টেক্সট কালার ডার্ক করা হলো */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">Total Customers</h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.totalCustomers}</p>
        </div>

        {/* Active Services */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">Active Services</h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.activeServices}</p>
        </div>

        {/* Pending Appointments */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">Pending Appointments</h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.pendingAppointments}</p>
        </div>
      </div>
    </div>
  );
}