"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Calendar, Star, MapPin, Phone, Mail, ChevronRight, ShieldCheck, Coffee, Wifi, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="h-20 border-b px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Hotel size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Royal Springs Resort</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#rooms" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Rooms</a>
          <a href="#amenities" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Amenities</a>
          <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
          <Link to="/login">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Staff Login</Button>
          </Link>
          <Link to="/book">
            <Button className="bg-blue-600 hover:bg-blue-700">Book Now</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000" 
            alt="Resort" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="flex justify-center mb-4">
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Experience Luxury in the Heart of Nature
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
            Welcome to Royal Springs Resort, where comfort meets elegance. Discover our world-class amenities and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 h-14 w-full sm:w-auto">
                Check Availability
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 h-14">
              View Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Bar */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <Card className="shadow-xl border-none p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Check In</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Calendar size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Select Date</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Check Out</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Calendar size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Select Date</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Guests</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Star size={18} className="text-blue-600" />
                <span className="text-sm font-medium">2 Adults, 0 Children</span>
              </div>
            </div>
            <div className="flex items-end">
              <Link to="/book" className="w-full">
                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-bold">
                  Search Rooms
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Features */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose Royal Springs?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">We provide the best services and facilities to ensure your stay is memorable and comfortable.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Wifi, title: 'High-Speed WiFi', desc: 'Stay connected with our complimentary high-speed internet throughout the resort.' },
            { icon: Waves, title: 'Infinity Pool', desc: 'Relax and unwind in our temperature-controlled infinity pool with stunning views.' },
            { icon: Coffee, title: 'Fine Dining', desc: 'Experience exquisite local and international cuisines prepared by our master chefs.' },
            { icon: ShieldCheck, title: '24/7 Security', desc: 'Your safety is our priority with round-the-clock security and surveillance.' },
            { icon: MapPin, title: 'Prime Location', desc: 'Located in the most serene part of the city, close to major attractions.' },
            { icon: Phone, title: 'Room Service', desc: 'Enjoy our premium room service available 24 hours a day for your convenience.' },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms Preview */}
      <section id="rooms" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Luxurious Rooms</h2>
              <p className="text-slate-500">Choose from our wide range of rooms designed for your comfort.</p>
            </div>
            <Link to="/book">
              <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">
                View All Rooms <ChevronRight size={20} className="ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Standard Room', price: '150,000', img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800' },
              { name: 'Deluxe Suite', price: '250,000', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' },
              { name: 'Presidential Suite', price: '450,000', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800' },
            ].map((room, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-lg group">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={room.img} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{room.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1"><Wifi size={14} /> Free WiFi</span>
                    <span className="flex items-center gap-1"><Coffee size={14} /> Breakfast</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">UGX {room.price}</span>
                      <span className="text-sm text-slate-500"> / night</span>
                    </div>
                    <Link to="/book">
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800">Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 container mx-auto px-4">
        <div className="bg-blue-600 rounded-3xl p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for an Unforgettable Stay?</h2>
            <p className="text-blue-100 text-lg mb-8">Contact us today to book your stay or inquire about our special packages and events.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <span className="text-lg font-medium">+256 772 514 889</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <span className="text-lg font-medium">info@royalspringsresort.com</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-12 h-16 font-bold rounded-2xl">
              Contact Us Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;