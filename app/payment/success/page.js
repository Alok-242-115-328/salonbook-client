'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiJson } from '@/lib/api';
import { toast } from 'sonner';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(() =>
    typeof window !== 'undefined' && Boolean(new URLSearchParams(window.location.search).get('session_id'))
  );
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const appointmentId = params.get('appointment_id');

    if (!sessionId) return;

    apiJson(`/api/payment/status?session_id=${encodeURIComponent(sessionId)}&appointment_id=${encodeURIComponent(appointmentId || '')}`)
      .then(() => router.refresh())
      .catch(err => toast.error(err.message || 'Payment confirmation failed'))
      .finally(() => setLoading(false));
  }, [router]);

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