'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Webhook ডাটাবেস আপডেট করার জন্য ২ সেকেন্ড অপেক্ষা করা হচ্ছে
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your payment. Your appointment has been confirmed.
        </p>

        {loading ? (
          <p className="text-sm text-gray-400 animate-pulse">Processing your payment...</p>
        ) : (
          <Link href="/dashboard/customer" className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
            Go to My Appointments
          </Link>
        )}
      </div>
    </div>
  );
}