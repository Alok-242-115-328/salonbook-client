'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarCheck, UserCircle, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const links = [
    { name: 'My Appointments', href: '/dashboard/customer', icon: CalendarCheck },
    { name: 'My Profile', href: '/dashboard/customer/profile', icon: UserCircle },
  ];

  return (
    // 👇 মেইন লেআউট ব্যাকগ্রাউন্ড ডার্ক করা হলো
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* 👇 Sidebar ডার্ক করা হলো */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 hidden md:block transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">SalonBook Customer</h2>
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

      <div className="md:hidden flex-1">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="font-bold text-pink-600 dark:text-pink-400">SalonBook Customer</span>
          <span className="w-10" />
        </div>

        {mobileNavOpen && (
          <nav className="p-4 space-y-2 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
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
        )}
      </div>

      {/* 👇 Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}