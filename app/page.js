'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const [services, setServices] = useState([]);
  
  // 👇 ডান দিকের ৩টি ছবির অ্যানিমেশন স্টেট
  const [activeIndex, setActiveIndex] = useState(0);

  // 👇 ৩টি নতুন ছবির লিংক
  const bannerImages = [
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop"
  ];

  useEffect(() => {
    apiFetch('/api/services')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((res) => {
        if (res.success) setServices(res.data.slice(0, 6));
      })
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  // 👇 প্রতি ৫ সেকেন্ড পর পর নিজে নিজে ছবি পরিবর্তন হবে
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 1. Banner Section */}
      <section className="relative w-full py-20 md:py-32 px-6 overflow-hidden bg-[#fdfbf7] dark:bg-gray-900 transition-colors duration-300">
        
        {/* 👇 আগের ব্যাকগ্রাউন্ড অ্যানিমেশন */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center animate-tilt-slide-1"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1920&auto=format&fit=crop')` }}
          ></div>
          <div 
            className="absolute inset-0 bg-cover bg-center animate-tilt-slide-2"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1920&auto=format&fit=crop')` }}
          ></div>
          <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/85 z-0"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
          
          {/* 👇 বাম দিকের টেক্সট এবং বাটন */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
              Your Beauty, <br className="hidden md:block"/> Our Passion
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
              Discover and book top-rated salon services near you. Professional stylists, relaxing atmosphere, and premium care—all in one place.
            </p>
            <Link 
              href="/services" 
              className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 shadow-lg"
            >
              Explore Salon Services
            </Link>
          </div>

          {/* 👇 ডান দিকের ৩টি ছবির প্যারালাল স্ট্যাক */}
          <div className="w-full md:w-1/2 flex justify-center items-center h-[350px] md:h-[450px] relative">
            <div className="relative w-full max-w-sm h-full flex justify-center items-center">
              {bannerImages.map((img, index) => {
                const position = (index - activeIndex + bannerImages.length) % bannerImages.length;
                
                // প্যারালাল স্টাইলের জন্য (কোনো কার্ভ বা রোটেশন নেই, শুধু পেছনে সরে যাবে)
                const isFront = position === 0;
                const isMiddle = position === 1;
                const isBack = position === 2;

                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`absolute w-64 h-80 md:w-72 md:h-[380px] rounded-xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out shadow-xl border-4 ${
                      isFront ? 'border-white dark:border-gray-700 z-30 opacity-100' : 
                      isMiddle ? 'border-gray-200 dark:border-gray-800 z-20 opacity-80' : 
                      'border-gray-200 dark:border-gray-800 z-10 opacity-60'
                    }`}
                    style={{
                      transform: isFront 
                        ? `translateY(0) translateX(0) scale(1)` 
                        : isMiddle 
                          ? `translateY(-1rem) translateX(1.5rem) scale(0.95)` 
                          : `translateY(-2rem) translateX(3rem) scale(0.9)`
                    }}
                  >
                    <img src={img} alt={`Salon ${index}`} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. Featured Services (Dynamic) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Salon Services</h2>
            <p className="text-gray-500 dark:text-gray-400">Handpicked treatments just for you.</p>
          </div>
          <Link href="/services" className="text-blue-600 dark:text-blue-400 hover:underline font-medium hidden md:block">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service._id} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800 flex flex-col">
              <img 
                src={service.image} 
                alt={service.serviceName} 
                className="h-48 w-full object-cover rounded-xl mb-4" 
              />
              <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{service.serviceName}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{service.category}</p>
              
              {/* 👇 ১. Short Description যোগ করা হলো */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="font-bold text-lg text-gray-900 dark:text-white">${service.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{service.duration} min</span>
              </div>

              {/* 👇 ২. View Details বাটন যোগ করা হলো */}
              <Link 
                href={`/services/${service._id}`} 
                className="block text-center mt-4 bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition font-medium"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Browse by Category */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-20 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Haircut & Styling", "Hair Coloring", "Hair Treatment", "Facial & Skincare", "Makeup", "Manicure & Pedicure", "Spa & Massage"].map((category, index) => (
              <Link 
                href={`/services?category=${encodeURIComponent(category)}`} 
                key={index} 
                className="bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 font-medium hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white cursor-pointer transition-colors text-gray-700 dark:text-gray-200"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}