"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 bg-gray-900 text-white mt-auto border-t border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Left Section: Logo and Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <img src="/logo.png" alt="Royal Springs Resort Logo" className="w-32 mb-4 object-contain" />
          <p className="text-lg font-semibold text-gray-300">
            © {new Date().getFullYear()} Royal Springs Resort. All rights reserved.
          </p>
          <p className="font-medium text-gray-400">Built by Breagan Otema</p>
        </div>

        {/* Middle Section: Quick Links */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-center md:text-left">
          <div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-green-500">Home</a></li>
              <li><a href="/rooms" className="hover:text-green-500">Rooms</a></li>
              <li><a href="/book" className="hover:text-green-500">Book Now</a></li>
              <li><a href="/about" className="hover:text-green-500">About Us</a></li>
              <li><a href="/contact" className="hover:text-green-500">Contact</a></li>
              <li><a href="/careers" className="hover:text-green-500">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Pages</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/rooms" className="hover:text-green-500">Our Rooms</a></li>
              <li><a href="/bookings" className="hover:text-green-500">Bookings</a></li>
              <li><a href="/guests" className="hover:text-green-500">Guest Services</a></li>
              <li><a href="/finance" className="hover:text-green-500">Finance</a></li>
              <li><a href="/incidents" className="hover:text-green-500">Incidents</a></li>
            </ul>
          </div>
        </div>

        {/* Right Section: Contact & Support */}
        <div className="text-center md:text-right">
          <p className="text-sm text-gray-500 mb-2">Designed and Managed by Nexterp Systems</p>
          <a 
            href="https://wa.me/256772514889" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-500 hover:text-green-600 font-semibold transition-colors duration-300 mb-2"
          >
            <span className="mr-2">Support: +256772514889</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;