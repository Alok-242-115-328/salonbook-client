'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { apiFetch, apiJson } from '@/lib/api';
import { toast } from 'sonner';

export default function ServiceDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');

  // সার্ভিস ডিটেইলস লোড
  const serviceId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    apiJson(`/api/services/${serviceId}`)
      .then(data => setService(data.data))
      .catch(err => toast.error(err.message || 'Failed to load service'))
      .finally(() => setLoading(false));
  }, [serviceId]);

  // বুকিং সাবমিট
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please login to book an appointment');
      router.push('/login');
      return;
    }

    if (session.user.role === 'admin') {
      toast.error('Admins cannot book appointments');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await apiFetch('/api/customer/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.email}`
        },
        body: JSON.stringify({ serviceId, appointmentDate, timeSlot, message }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Appointment requested successfully!');
        router.push('/dashboard/customer');
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-900 dark:text-white min-h-screen bg-white dark:bg-gray-900">Loading...</div>;
  if (!service) return <div className="p-20 text-center text-red-500 min-h-screen bg-white dark:bg-gray-900">Service not found</div>;

    return (
    // 👇 মেইন ব্যাকগ্রাউন্ড (পুরো স্ক্রিন জুড়ে থাকবে)
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* 👇 কন্টেন্ট সেন্টার করার কন্টেইনার */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* 👇 কার্ড কন্টেইনার */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col md:flex-row gap-8 transition-colors duration-300">
          <img src={service.image} className="w-full md:w-1/2 h-80 object-cover rounded-xl" />
          
          <div className="flex-1">
            {/* সার্ভিসের নাম */}
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{service.serviceName}</h1>
            
            {/* ক্যাটাগরি */}
            <p className="text-gray-500 dark:text-gray-400 mb-4">{service.category}</p>
            
            {/* ডেসক্রিপশন */}
            <p className="text-gray-700 dark:text-gray-300 mb-6">{service.description}</p>
            
            <div className="flex gap-4 mb-8 text-lg font-bold">
              {/* দাম */}
              <span className="text-green-600 dark:text-green-400">${service.price}</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              {/* ডিউরেশন */}
              <span className="text-gray-600 dark:text-gray-400">{service.duration} mins</span>
            </div>

            {/* বুকিং ফর্ম কন্টেইনার */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Book an Appointment</h3>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
                  <input type="date" required value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time Slot</label>
                  <select required value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none">
                    <option value="">Select a time slot</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Message (Optional)</label>
                  <textarea rows="2" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none" placeholder="Any special requests?"></textarea>
                </div>
                
                <button type="submit" disabled={bookingLoading} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition">
                  {bookingLoading ? 'Requesting...' : 'Request Appointment'}
                </button>
              </form>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}