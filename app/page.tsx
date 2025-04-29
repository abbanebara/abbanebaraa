"use client";

import React, { useState, useEffect } from 'react';
import { Square, Mail, Phone, ArrowRight } from "lucide-react";
import Link from 'next/link';
import PricingPage from '@/components/ofer';

import BlogSection from '@/components/BlogSection';
import SliderPage from '@/components/slider';
import { HeroVideoDialog } from "@/components/hero-video-dialog"
export  function Home() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <HeroVideoDialog
          videoSrc="https://youtu.be/sUu85AIP-sg?si=PfLVQvuhsyxLAKOA"
          title="Discover Our Amazing Product"
          description="Watch this video to learn how our product can transform your business"
          thumbnailSrc="/placeholder.svg?height=720&width=1280"
        />
      </div>
    </main>
  )
}




interface FeatureCard {
  icon: JSX.Element;
  title: string;
  description: string;
  
}

interface Article {
  image: string;
  date: string;
  title: string;
}


 const ContactPage = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!Object.values(formData).every(Boolean)) {
      alert('Please fill in all fields');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }
    
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({
      lastName: '',
      firstName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-[900px] bg-[#1F4C4C] rounded-2xl p-8 text-[#9BA4AB] flex flex-col items-center shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">Chat with us</h1>
          <p className="text-lg">Reach out, and let's create a universe of possibilities together!</p>
        </div>

        <div className="flex gap-10 w-full items-start flex-wrap md:flex-nowrap">
          <div className="flex-1 min-w-[280px]">
            <h2 className="text-xl mb-2">Let's connect constellations</h2>
            <p>Let's align our constellations! Reach out.</p>
            
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#285650] border border-[#285650] rounded-md text-[#9BA4AB]"
                />
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#285650] border border-[#285650] rounded-md text-[#9BA4AB]"
                />
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#285650] border border-[#285650] rounded-md text-[#9BA4AB] col-span-full"
                />
                <input
                  type="tel"
                  id="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#285650] border border-[#285650] rounded-md text-[#9BA4AB] col-span-full"
                />
                <textarea
                  id="message"
                  placeholder="Message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#285650] border border-[#285650] rounded-md text-[#9BA4AB] col-span-full h-[100px] resize-vertical"
                />
                <button
                  type="submit"
                  className="col-span-full bg-[#4BB96A] text-white p-3 rounded-md flex items-center justify-center gap-2 hover:bg-[#3d9956] transition-colors"
                >
                  Send the message
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>

          <div className="flex-1 min-w-[300px]">
            <img
              src="/images/6.jpeg"
              alt="Profile"
              className="w-full max-w-[400px] h-[300px] rounded-xl shadow-lg object-cover"
            />
            <div className="mt-4 flex gap-4 justify-center flex-wrap">
              <span className="flex items-center gap-2">
                <Phone size={16} />
                +013 945654775
              </span>
              <span className="flex items-center gap-2">
                <Mail size={16} />
                bilgreen2023@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentArticleSlide, setCurrentArticleSlide] = useState(0);
  const [activeView, setActiveView] = useState<'seller' | 'buyer'>('seller');

  // Hero Slides Data
  const heroSlides = [
    {
      image: '/images/5.jpeg',
      title: 'Turn Waste Into Wealth',
      buttonText: 'Join us'
    },
    {
      image: '/images/6.jpeg',
      title: 'Sustainable Solutions',
      buttonText: 'Scrap'
    },
    {
      image: '/images/2.jpeg',
      title: 'Recycle for Tomorrow',
      buttonText: 'Learn More'
    }
  ];

  // Updated Articles Data
  const articles: Article[] = [
    {
      image: '/images/5.jpeg',
      date: '2025-02-14',
      title: 'bilgreen secures 2nd place at the Egypt proptech challenge '
    },
    {
      image: '/images/2.jpeg',
      date: '2025-02-10',
      title: 'bilgreen: Paving the Way to a Greener, Sustainable Future'
    },
    {
      image: '/images/1.jpeg',
      date: '2025-02-11',
      title: 'bilgreen: Leading the Way in Industrial Waste Management'
    }
  ];

  // Blog Articles Data
  const featuredPosts = [
    {
      id: '1',
      title: 'Believing neglected so so allowance existence departure.',
      excerpt: 'Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.',
      date: '08-11-2021',
      category: 'Category',
      imageUrl: '/images/1.jpeg',
      slug: 'believing-neglected'
    },
    {
      id: '2',
      title: 'In design active temper be uneasy. Thirty for remove plenty regard you.',
      excerpt: 'Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.',
      date: '08-11-2021',
      category: 'Category',
      imageUrl: '/images/2.jpeg',
      slug: 'design-active-temper'
    }
  ];
  
  const sidebarPosts = [
    {
      id: '3',
      title: 'Partiality on or continuing in particular principles',
      excerpt: '',
      date: '08-11-2021',
      category: 'Category',
      imageUrl: '/images/7.png',
      slug: 'partiality-continuing'
    },
    {
      id: '4',
      title: 'Do believing oh disposing to supported allowance we.',
      excerpt: '',
      date: '08-11-2021',
      category: 'Category',
      imageUrl: '/images/3.jpeg',
      slug: 'believing-disposing'
    },
    {
      id: '5',
      title: 'Village did removed enjoyed explain nor ham saw.',
      excerpt: '',
      date: '08-11-2021',
      category: 'Category',
      imageUrl: '/images/2.jpeg',
      slug: 'village-removed'
    }
  ];
  

  // Seller Features Data
  const sellerFeatures: FeatureCard[] = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>
      ),
      title: 'Dedicated Help',
      description: 'Our team ensures smooth support throughout every transaction.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: 'Smart Matching',
      description: 'Advanced algorithms to connect you with the right seller.'
    }
  ];

  // Buyer Features Data
  const buyerFeatures: FeatureCard[] = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      title: 'Efficient Buying',
      description: 'Find and purchase materials quickly through our streamlined platform.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      ),
      title: 'Global Network',
      description: 'Access a worldwide network of verified sellers and suppliers.'
    }
  ];

  // Auto-slide effects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArticleSlide((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
     

      <div className="min-h-screen space-y-1">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 p-6">
       
     
          {/* Hero Slider */}
          <div className="relative h-96 md:col-span-2 rounded-2xl overflow-hidden">
            {heroSlides.map((slide, index) => ( 
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex flex-col items-center justify-center p-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 shadow-text">
                    {slide.title}
                  </h1>
                  <button className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-all">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Updated Articles Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-green-600 text-lg font-semibold uppercase mb-2">MOST COMMON</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Most active articles</h2>
          <p className="text-gray-600 mb-8">Our best articles and view in the business sector</p>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
            {articles.map((article, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-transform">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-gray-500 mb-2">{article.date}</p>
                  <h3 className="text-xl font-semibold mb-4">{article.title}</h3>
                  <button className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors">
                    Check now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Slider View */}
          <div className="md:hidden relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentArticleSlide * 100}%)` }}
            >
              {articles.map((article, index) => (
                <div key={index} className="min-w-full px-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-gray-500 mb-2">{article.date}</p>
                      <h3 className="text-xl font-semibold mb-4">{article.title}</h3>
                      <button className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors">
                        Check now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setCurrentArticleSlide((prev) => (prev - 1 + articles.length) % articles.length)}
            >
              ←
            </button>
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setCurrentArticleSlide((prev) => (prev + 1) % articles.length)}
            >
              →
            </button>
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 bg-teal-900 text-white px-8 py-3 rounded-md hover:bg-teal-800 transition-colors">
              VIEW MORE
              <span>→</span>
            </button>
          </div>
        </section>

        {/* Features Section */}
        <div className="bg-teal-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-green-500 mb-2">WHY BILGREEN ?</h3>
            <h2 className="text-3xl font-bold mb-8">One platform for all your needs</h2>

            <div className="inline-flex bg-white rounded-full p-1 mb-8">
              <button
                className={`px-8 py-2 rounded-full transition-all ${
                  activeView === 'seller'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveView('seller')}
              >
                SELLER
              </button>
              <button
                className={`px-8 py-2 rounded-full transition-all ${
                  activeView === 'buyer'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveView('buyer')}
              >
                BUYER
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeView === 'seller' ? sellerFeatures : buyerFeatures).map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-gray-900">
                  <div className="text-green-500 w-6 h-6 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link href="/admin" className="text-sm font-medium">
  Admin Dashboard
</Link>
<PricingPage/>
<Home/>
<BlogSection 
        featuredPosts={featuredPosts}
        sidebarPosts={sidebarPosts}
      />
      <ContactPage/>
      </div>

 
      
    </>
  );
};

export default Page;