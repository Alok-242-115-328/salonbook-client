import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-transparent dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="bg-white dark:bg-transparent p-1.5 rounded-full dark:p-0 transition-all">
                <Image 
                  src="/salon-logo.png" 
                  alt="SalonBook Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain dark:brightness-0 dark:invert" 
                />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">SalonBook</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Your premier destination for beauty and relaxation. Book top-rated salon services easily and enjoy premium care.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 text-sm font-medium">
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>

          {/* 2. Important Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Browse Services</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* 3. Contact Information */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Phone: +1 886-887-6666</li>
              <li>Email: hello@salonbook.com</li>
              <li>Support: support@salonbook.com</li>
            </ul>
          </div>

          {/* 4. Address & Opening Hours */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Visit Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>62/A Shibgong ,<br />SYLHET 62/A</li>
              <li className="pt-2">
                <strong className="text-white font-semibold">Hours:</strong><br />
                Mon-Fri: 9:00 AM - 8:00 PM<br />
                Sat-Sun: 10:00 AM - 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SalonBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}