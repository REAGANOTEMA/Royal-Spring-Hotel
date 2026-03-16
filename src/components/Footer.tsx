"use client";

import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-16 px-6 bg-slate-950 text-white mt-auto border-t border-slate-900">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <img src="/logo.png" alt="Royal Springs Resort Logo" className="h-20 object-contain" />
          <p className="text-slate-400 leading-relaxed">
            Experience the ultimate luxury at Royal Springs Resort. Surrounded by lush vegetation and serene compounds, we offer a sanctuary for the soul.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-blue-500">Quick Links</h3>
          <ul className="space-y-4 text-slate-400">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/rooms" className="hover:text-white transition-colors">Our Rooms</a></li>
            <li><a href="/book" className="hover:text-white transition-colors">Book Now</a></li>
            <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-blue-500">Contact Us</h3>
          <ul className="space-y-4 text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-blue-500 shrink-0" />
              <span>Royal Springs Resort, <br/>Kampala, Uganda</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-blue-500 shrink-0" />
              <span>+256 772 514 889</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-blue-500 shrink-0" />
              <span>info@royalspringsresort.com</span>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold mb-4">Need Support?</h3>
          <p className="text-sm text-slate-400 mb-6">Our team is available 24/7 to assist you with your inquiries.</p>
          <a 
            href="https://wa.me/256772514889" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all"
          >
            Chat with Support
          </a>
        </div>
      </div>

      <div className="container mx-auto mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Royal Springs Resort. All rights reserved.</p>
        <p className="font-bold">Designed and Managed by Nexterp Systems</p>
      </div>
    </footer>
  );
};

export default Footer;