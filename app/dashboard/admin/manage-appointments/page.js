'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { apiJson } from '@/lib/api';

export default function ManageAppointments() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // 👇 কাস্টম মডাল স্টেট (ব্রাউজার পপআপ রিমুভ করার জন্য)
  const [cancelModal, setCancelModal] = useState({ isOpen: false, appointmentId: null });

  const fetchAppointments = async () => {
    try {
      if (!session?.user?.email) return;
      const data = await apiJson('/api/admin/appointments', {
        headers: { 'Authorization': `Bearer ${session.user.email}` }
      });
      setAppointments(data.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (session) fetchAppointments(); }, [session]);

  const handleConfirm = async (id) => {
    try {
      await apiJson(`/api/admin/appointments/${id}/confirm`, {
        method: 'PATCH', headers: { 'Authorization': `Bearer ${session.user.email}` }
      });
      toast.success('Confirmed');
      fetchAppointments();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  // 👇 ক্যান্সেল বাটনে ক্লিক করলে ব্রাউজার পপআপের বদলে আমাদের কাস্টম মডাল ওপেন হবে
  const openCancelModal = (id) => {
    setCancelModal({ isOpen: true, appointmentId: id });
  };

  // 👇 মডালে "Yes" দিলে আসল ক্যান্সেল এপিআই কল হবে
  const confirmCancel = async () => {
    const id = cancelModal.appointmentId;
    setCancelModal({ isOpen: false, appointmentId: null }); // মডাল বন্ধ করা হলো
    
    try {
      await apiJson(`/api/admin/appointments/${id}/cancel`, {
        method: 'PATCH', headers: { 'Authorization': `Bearer ${session.user.email}` }
      });
      toast.success('Cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(app => app.status === filter);

  if (loading) return <div className="p-8 text-gray-900 dark:text-white">Loading appointments...</div>;

  return (
    <div className="p-6 text-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">Manage Appointments</h1>
      
      {/* ফিল্টার বাটন */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize border transition-colors ${
              filter === f 
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAppointments.map((app) => (
          <div key={app._id} className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 flex flex-col md:flex-row justify-between gap-4 transition-colors duration-300">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <img src={app.serviceId?.image} alt="service" className="w-12 h-12 rounded object-cover" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{app.serviceId?.serviceName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer: {app.customerId?.name} ({app.customerId?.email})</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Date:</strong> {app.appointmentDate} | <strong>Time:</strong> {app.timeSlot}
              </p>
              {app.message && <p className="text-sm italic text-gray-600 dark:text-gray-400 mt-1">"{app.message}"</p>}
            </div>

            <div className="flex flex-col items-start md:items-end justify-between">
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' 
                  : app.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                  {app.status.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  app.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {app.paymentStatus.toUpperCase()}
                </span>
              </div>
              
              <div className="flex gap-2 mt-4">
                {app.status === 'pending' && (
                  <button onClick={() => handleConfirm(app._id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
                    Confirm
                  </button>
                )}
                {(app.status === 'pending' || app.status === 'confirmed') && (
                  // 👇 openCancelModal কল করা হলো
                  <button onClick={() => openCancelModal(app._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredAppointments.length === 0 && (
          <p className="text-center p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors">
            No appointments found.
          </p>
        )}
      </div>

      {/* 👇 কাস্টম প্রফেশনাল কনফার্মেশন মডাল */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Cancel Appointment</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to cancel this appointment? This action cannot be undone.</p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setCancelModal({ isOpen: false, appointmentId: null })} 
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
              >
                No, Keep it
              </button>
              <button 
                onClick={confirmCancel} 
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}