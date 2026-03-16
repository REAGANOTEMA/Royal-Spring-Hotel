"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Star, MapPin, Phone, Mail, ChevronRight, ShieldCheck, Coffee, Wifi, Waves, Play } from 'lucide-react';
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
            <a href="#rooms" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Rooms</a>
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

      {/* Video Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Using a high-quality luxury hotel stock video */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover brightness-[0.4]"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-hotel-room-with-a-view-of-the-ocean-42475-large.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="flex justify-center mb-6">
            <div className="flex gap-1.5 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            A Warm Welcome to <br/>
            <span className="text-blue-400">Royal Springs Resort</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Experience the pinnacle of luxury where lush vegetation meets world-class comfort. Your sanctuary in the heart of nature awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-xl px-10 h-16 w-full sm:w-auto font-bold rounded-2xl shadow-2xl">
                Reserve Your Stay
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-slate-900 text-xl px-10 h-16 font-bold rounded-2xl">
              Explore Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Features / Amenities */}
      <section id="amenities" className="py-24 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Exquisite Amenities</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Every detail at Royal Springs is crafted to provide you with an unforgettable experience of luxury and peace.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { icon: Waves, title: 'Infinity Pool', desc: 'Dive into crystal clear waters with breathtaking views of our lush compounds.' },
            { icon: Coffee, title: 'Gourmet Dining', desc: 'Savor organic, farm-to-table delicacies prepared by our award-winning chefs.' },
            { icon: Wifi, title: 'Ultra-Fast WiFi', desc: 'Stay connected with high-speed fiber optic internet throughout the resort.' },
            { icon: ShieldCheck, title: 'Elite Security', desc: 'Your safety is guaranteed with our 24/7 professional security detail.' },
            { icon: MapPin, title: 'Nature Trails', desc: 'Explore our vast vegetation and serene compounds on guided nature walks.' },
            { icon: Hotel, title: 'Luxury Suites', desc: 'Rest in our meticulously designed rooms featuring premium linens and views.' },
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

      {/* Video Showcase Section */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Immerse Yourself in <br/> Pure Tranquility</h2>
            <p className="text-slate-400 text-xl leading-relaxed">
              From our lush green compounds to our exquisitely prepared food, every moment at Royal Springs is a celebration of life. Watch our story and feel the warmth of our hospitality.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-blue-500">20+</span>
                <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Luxury Rooms</span>
              </div>
              <div className="w-px h-12 bg-slate-800 mx-4" />
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-blue-500">5★</span>
                <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Service Rating</span>
              </div>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video group">
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-with-a-swimming-pool-and-palm-trees-42474-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-all">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Play className="text-white fill-white ml-1" size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
};

export default Index;