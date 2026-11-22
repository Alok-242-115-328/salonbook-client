'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/salon-logo.png" 
                alt="SalonBook Logo" 
                width={48} 
                height={48} 
                className="object-contain w-auto h-12 dark:invert dark:brightness-200" 
              />
              <span className="font-bold text-2xl tracking-tight text-black dark:text-white">SalonBook</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium">Home</Link>
            <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium">Browse Services</Link>
            
            <ThemeToggle />

            {isPending ? (
              <span className="text-gray-500">Loading...</span>
            ) : !session ? (
              <>
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium">Sign In</Link>
                <Link href="/register" className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <img 
                    src={session.user.image || 'https://via.placeholder.com/40'} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                  <span className="font-medium text-black dark:text-white">{session.user.name}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link 
                    href={session.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'} 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-300 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 pt-2 pb-4 space-y-2">
          <Link href="/" className="block py-2 text-gray-700 dark:text-gray-300 font-medium">Home</Link>
          <Link href="/services" className="block py-2 text-gray-700 dark:text-gray-300 font-medium">Browse Services</Link>
          
          {!session ? (
            <>
              <Link href="/login" className="block py-2 text-gray-700 dark:text-gray-300 font-medium">Sign In</Link>
              <Link href="/register" className="block py-2 text-black dark:text-white font-medium">Sign Up</Link>
            </>
          ) : (
            <>
              <Link 
                href={session.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'} 
                className="block py-2 text-gray-700 dark:text-gray-300 font-medium"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="block py-2 text-red-600 dark:text-red-400 font-medium">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}