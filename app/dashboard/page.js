'use client';
import { authClient } from '@/lib/auth-client';

export default function DashboardOverview() {
  const { data: session } = authClient.useSession();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Welcome Back,</h3>
          <p className="text-2xl font-bold">{session?.user?.name || 'User'}!</p>
        </div>
      </div>
    </div>
  );
}