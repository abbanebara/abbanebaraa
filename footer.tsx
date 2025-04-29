"use client"
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MessageCircleMore } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#003731] text-white py-16 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-10">
        {/* Logo and Company Info Section */}
        <div className="space-y-6">
          {/* Logo SVG */}
          <svg 
            className="w-36 h-24"
            viewBox="0 0 841.89 595.28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              className="font-black text-[68.57px]"
              fill="#8acc00"
              transform="translate(250.24 515.22)"
            >
              BILGREEN
            </text>
            <path
              fill="#8acc00"
              d="m230.87,68.24v380.16h380.16V68.24H230.87Zm332.64,332.64h-141.74v-143.9h141.74v143.9Z"
            />
          </svg>

          <p className="text-[#a7c0bc] leading-relaxed max-w-md">
            Mrkoon is a leading digital marketplace dedicated to sustainable industrial waste management,
            connecting companies with surplus materials to scrap traders and recyclers.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <Link href="#" className="text-[#a7c0bc] hover:text-white transition-colors">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="text-[#a7c0bc] hover:text-white transition-colors">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="text-[#a7c0bc] hover:text-white transition-colors">
              <MessageCircleMore size={20} />
            </Link>
            <Link href="#" className="text-[#a7c0bc] hover:text-white transition-colors">
              <Linkedin size={20} />
            </Link>
          </div>
        </div>

        {/* Scrap Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Scrap</h3>
          <ul className="space-y-3">
            {['heavy tools', 'Battery', 'marines scrap', 'CONCRETE PLANT', 'Mix scrap'].map((item) => (
              <li key={item}>
                <Link 
                  href="#" 
                  className="text-[#a7c0bc] hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Help</h3>
          <ul className="space-y-3">
            {[
              'About us',
              'Contact us',
              'Blog',
              'Usage policy',
              'Terms and conditions'
            ].map((item) => (
              <li key={item}>
                <Link 
                  href="#" 
                  className="text-[#a7c0bc] hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;