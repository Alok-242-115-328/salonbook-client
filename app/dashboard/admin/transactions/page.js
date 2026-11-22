'use client';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export default function Transactions() {
  const { data: session } = authClient.useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('http://localhost:5000/api/admin/transactions', {
        headers: { 'Authorization': `Bearer ${session.user.email}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setTransactions(data.data);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (loading) return <div className="p-8 text-gray-900 dark:text-white">Loading transactions...</div>;

  return (
    // 👇 মেইন কন্টেইনারে টেক্সট কালার যোগ করা হলো
    <div className="p-6 text-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">Payment Transactions</h1>
      
      {/* 👇 টেবিল কন্টেইনার */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-transparent dark:border-gray-700 overflow-x-auto transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          
          {/* 👇 টেবিল হেডার */}
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <tr>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Service</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Currency</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date</th>
            </tr>
          </thead>
          
          {/* 👇 টেবিল বডি */}
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 text-gray-900 dark:text-white">{t.customerId?.name || 'N/A'}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{t.appointmentId?.serviceId?.serviceName || 'N/A'}</td>
                <td className="p-4 font-semibold text-gray-900 dark:text-white">${t.amount}</td>
                <td className="p-4 uppercase text-gray-700 dark:text-gray-300">{t.currency}</td>
                <td className="p-4">
                  {/* 👇 স্ট্যাটাস ব্যাজ */}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    t.status === 'paid' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            
            {transactions.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}