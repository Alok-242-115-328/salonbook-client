'use client';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { apiJson } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (session?.user?.email) {
      try {
        const data = await apiJson('/api/customer/appointments', {
          headers: { 'Authorization': `Bearer ${session.user.email}` }
        });
        setAppointments(data.data);
      } catch (error) {
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [session]);

  // ১. পেমেন্ট হ্যান্ডেল করার ফাংশন
  const handlePayment = async (appointmentId) => {
    try {
      const data = await apiJson('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.email}`
        },
        body: JSON.stringify({ appointmentId })
      });

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  // ২. ক্যান্সেল করার ফাংশন
  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await apiJson(`/api/customer/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${session.user.email}` }
      });
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel');
    }
  };

  if (loading) return <div className="p-8 text-gray-900 dark:text-white">Loading...</div>;

  return (
    // 👇 মেইন কন্টেইনারে টেক্সট কালার ডার্ক মোডের জন্য যোগ করা হলো
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white">
      
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
      
      {appointments.length === 0 ? (
        // 👇 খালি অবস্থার কার্ড
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
          <p className="mb-4">You have no appointments yet.</p>
          <Link href="/services" className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg transition hover:bg-gray-800 dark:hover:bg-gray-200">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            // 👇 অ্যাপয়েন্টমেন্ট কার্ড
            <div key={app._id} className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300">
              
              <div className="flex gap-4 items-center">
                <img src={app.serviceId?.image} className="w-16 h-16 rounded object-cover" />
                <div>
                  {/* সার্ভিসের নাম */}
                  <h3 className="font-bold text-gray-900 dark:text-white">{app.serviceId?.serviceName}</h3>
                  {/* ডেট ও টাইম */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">{app.appointmentDate} | {app.timeSlot}</p>
                  {/* দাম */}
                  <p className="text-sm font-semibold mt-1 text-gray-900 dark:text-white">${app.servicePrice}</p>
                </div>
              </div>

              <div className="text-left md:text-right w-full md:w-auto">
                {/* 👇 স্ট্যাটাস ব্যাজ (Pending/Confirmed/Cancelled) ডার্ক মোডে সুন্দর দেখানোর জন্য */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' : 
                  app.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 
                  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                  {app.status.toUpperCase()}
                </span>
                
                {/* পেমেন্ট স্ট্যাটাস */}
                <p className="text-xs mt-2 text-gray-700 dark:text-gray-300">
                  Payment: <b>{app.paymentStatus.toUpperCase()}</b>
                </p>

                {app.status === 'pending' && (
                  <button onClick={() => handleCancel(app._id)} className="mt-2 text-red-500 dark:text-red-400 text-sm hover:underline block md:ml-auto transition-colors">
                    Cancel Request
                  </button>
                )}

                {app.status === 'confirmed' && app.paymentStatus === 'unpaid' && (
                  <button 
                    onClick={() => handlePayment(app._id)}
                    className="mt-3 w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition block md:ml-auto"
                  >
                    Pay Now
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}