'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Scissors, 
  PlusCircle, 
  CalendarCheck, 
  Users, 
  CreditCard, 
  UserCircle 
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isBlocked, setIsBlocked] = useState(false);

  // সার্ভার থেকে ব্লক স্ট্যাটাস চেক করা
  useEffect(() => {
    const checkBlockStatus = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch('http://localhost:5000/api/user/status', {
            headers: { 'Authorization': `Bearer ${session.user.email}` }
          });
          const data = await res.json();
          
          if (data.isBlocked) {
            setIsBlocked(true);
            toast.error("Your account has been blocked by the admin!");
            await authClient.signOut();
            router.push('/login');
          }
        } catch (error) {
          console.error("Error checking block status:", error);
        }
      } else if (!isPending && !session) {
        router.push('/login');
      }
    };

    checkBlockStatus();
  }, [session, isPending, router]);

  if (isPending) return <div className="p-8 text-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">Loading...</div>;
  
  if (!session || isBlocked) return null; 

  const isAdmin = session.user.role === 'admin';

  const adminLinks = [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Manage Services', href: '/dashboard/admin/manage-services', icon: Scissors },
    { name: 'Add Service', href: '/dashboard/admin/add-service', icon: PlusCircle },
    { name: 'Appointments', href: '/dashboard/admin/manage-appointments', icon: CalendarCheck },
    { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
    { name: 'My Profile', href: '/dashboard/admin/my-profile', icon: UserCircle },
  ];

  const customerLinks = [
    { name: 'My Appointments', href: '/dashboard/customer', icon: CalendarCheck },
    { name: 'My Profile', href: '/dashboard/customer/profile', icon: UserCircle },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  return (
    // 👇 মেইন লেআউট ব্যাকগ্রাউন্ড ডার্ক করা হলো
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* 👇 Sidebar ডার্ক করা হলো */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 hidden md:block transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">SalonBook {isAdmin ? 'Admin' : 'Customer'}</h2>
        </div>
        <nav className="p-4 space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive 
                    ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 👇 Main Content */}
      <main className="flex-1 p-8 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}