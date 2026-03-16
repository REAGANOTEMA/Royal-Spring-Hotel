"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, Star, MapPin, Phone, Mail, ChevronRight, ShieldCheck, Coffee, Wifi, Waves, Play, Image as ImageIcon, Utensils, BedDouble, Leaf, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000',
    title: 'Royal Spring Hotel Iganga',
    subtitle: 'Experience the pinnacle of luxury in the heart of nature.'
  },
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000',
    title: 'Lush Green Compounds',
    subtitle: 'Serene environments designed for your ultimate relaxation.'
  },
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2000',
    title: 'Exquisite Comfort',
    subtitle: 'Meticulously designed rooms with premium amenities.'
  },
  {
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000',
    title: 'Gourmet Dining',
    subtitle: 'Savor world-class delicacies prepared by our master chefs.'
  }
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="h-20 border-b px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Royal Springs Logo" className="h-12 object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline">Royal Springs Resort</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#experience" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Experience</a>
          <a href="#amenities" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Amenities</a>
          <Link to="/login">
            <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50 font-bold">Staff Portal</Button>
          </Link>
          <Link to="/book">
            <Button className="bg-blue-700 hover:bg-blue-800 font-bold shadow-lg shadow-blue-900/20">Book Now</Button>
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={28} className="text-slate-900" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-white">
              <div className="flex flex-col gap-6 mt-12">
                <a href="#experience" className="text-lg font-bold text-slate-900">Experience</a>
                <a href="#amenities" className="text-lg font-bold text-slate-900">Amenities</a>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full border-blue-700 text-blue-700 font-bold h-12">Staff Portal</Button>
                </Link>
                <Link to="/book" className="w-full">
                  <Button className="w-full bg-blue-700 font-bold h-12">Book Now</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Cinematic Sliding Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img 
              src={heroSlides[currentSlide].url} 
              alt="Royal Spring Iganga" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 text-center px-4 max-w-5xl">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="flex gap-1.5 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
            </div>
          </motion.div>
          
          <motion.h1 
            key={`title-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tighter"
          >
            {heroSlides[currentSlide].title}
          </motion.h1>
          
          <motion.p 
            key={`sub-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

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

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "w-12 h-1.5 rounded-full transition-all duration-500",
                currentSlide === i ? "bg-blue-500 w-20" : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
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