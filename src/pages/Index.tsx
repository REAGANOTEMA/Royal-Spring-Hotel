"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Star, MapPin, Phone, Mail, ChevronRight, ShieldCheck, Coffee, Wifi, Waves, Play, Image as ImageIcon, Utensils, BedDouble, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="h-20 border-b px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Royal Springs Logo" className="h-12 object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline">Royal Springs Resort</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-8">
            <a href="#experience" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Experience</a>
            <a href="#amenities" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Amenities</a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Contact</a>
          </div>
          <Link to="/login">
            <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50 font-bold">Staff Portal</Button>
          </Link>
          <Link to="/book">
            <Button className="bg-blue-700 hover:bg-blue-800 font-bold shadow-lg shadow-blue-900/20">Book Now</Button>
          </Link>
        </div>
      </nav>

      {/* Main Video Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover brightness-[0.45]"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-with-a-swimming-pool-and-palm-trees-42474-large.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="flex justify-center mb-6 animate-bounce">
            <div className="flex gap-1.5 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tighter">
            A Warm Welcome to <br/>
            <span className="text-blue-400">Royal Springs</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Experience the pinnacle of luxury where lush vegetation meets world-class comfort. Your sanctuary in the heart of nature awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-xl px-10 h-16 w-full sm:w-auto font-bold rounded-2xl shadow-2xl transition-transform hover:scale-105">
                Reserve Your Stay
              </Button>
            </Link>
            <a href="#experience">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-slate-900 text-xl px-10 h-16 font-bold rounded-2xl w-full sm:w-auto transition-transform hover:scale-105">
                Explore The Resort
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* The Royal Experience - Video Showcase */}
      <section id="experience" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">The Royal Experience</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Immerse yourself in the beauty of our resort through our cinematic showcase.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vegetation & Compound Video */}
            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                <source src="https://assets.mixkit.co/videos/preview/mixkit-palm-trees-and-a-blue-sky-42473-large.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                  <Leaf className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Lush Vegetation</h3>
                <p className="text-slate-300 text-sm">Explore our serene compounds surrounded by nature's finest greenery.</p>
              </div>
            </div>

            {/* Luxury Beds & Rooms Video */}
            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-hotel-room-with-a-view-of-the-ocean-42475-large.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                  <BedDouble className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Exquisite Comfort</h3>
                <p className="text-slate-300 text-sm">Rest in our meticulously designed rooms featuring premium linens and views.</p>
              </div>
            </div>

            {/* Gourmet Food Video */}
            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                <source src="https://assets.mixkit.co/videos/preview/mixkit-waiter-serving-a-plate-of-food-in-a-restaurant-42477-large.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                  <Utensils className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Gourmet Dining</h3>
                <p className="text-slate-300 text-sm">Savor organic, farm-to-table delicacies prepared by our award-winning chefs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-24 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">World-Class Amenities</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Every detail at Royal Springs is crafted to provide you with an unforgettable experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { icon: Waves, title: 'Infinity Pool', desc: 'Dive into crystal clear waters with breathtaking views of our lush compounds.' },
            { icon: Wifi, title: 'Ultra-Fast WiFi', desc: 'Stay connected with high-speed fiber optic internet throughout the resort.' },
            { icon: ShieldCheck, title: 'Elite Security', desc: 'Your safety is guaranteed with our 24/7 professional security detail.' },
          ].map((feature, i) => (
            <Card key={i} className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden rounded-3xl">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center mb-8 group-hover:bg-blue-700 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                  <feature.icon size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
};

export default Index;