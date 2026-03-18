"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Menu, Palmtree, Utensils, BedDouble, Camera, Leaf, Waves, ShieldCheck, ChevronRight, Quote, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';
import VoiceConcierge from '@/components/VoiceConcierge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=2000',
    title: 'Tropical Paradise',
    subtitle: 'Experience the serenity of our lush palm gardens and vibrant tropical flora.',
  },
  {
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=2000',
    title: 'Royal Comfort',
    subtitle: 'Indulge in our masterfully designed suites featuring the finest luxury linens.',
  },
  {
    url: 'https://images.unsplash.com/photo-1598502136455-c959d7715b21?auto=format&fit=crop&q=80&w=2000',
    title: 'Garden Sanctuary',
    subtitle: 'Relax in our serene outdoor lounges surrounded by majestic greenery.',
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Luxury Traveler",
    text: "The most peaceful stay I've ever had. The gardens are truly a sanctuary for the soul.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "David Okello",
    role: "Business Executive",
    text: "World-class service and impeccable attention to detail. Royal Springs is my home in Kampala.",
    avatar: "https://i.pravatar.cc/150?u=david"
  },
  {
    name: "Elena Rodriguez",
    role: "Nature Enthusiast",
    text: "A perfect blend of luxury and nature. The dining experience under the palms is unforgettable.",
    avatar: "https://i.pravatar.cc/150?u=elena"
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
      <nav className="h-20 border-b px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Royal Springs Logo" className="h-12 object-contain" />
          <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:inline uppercase">Royal Springs</span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a href="#experience" className="text-sm font-bold text-slate-600 hover:text-blue-700 transition-colors uppercase tracking-widest">Experience</a>
          <a href="#gallery" className="text-sm font-bold text-slate-600 hover:text-blue-700 transition-colors uppercase tracking-widest">Gallery</a>
          <Link to="/login">
            <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50 font-black rounded-xl">STAFF PORTAL</Button>
          </Link>
          <Link to="/book">
            <Button className="bg-blue-700 hover:bg-blue-800 font-black rounded-xl shadow-lg shadow-blue-900/20 px-8">BOOK NOW</Button>
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu size={28} /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="flex flex-col gap-6 mt-12">
                <Link to="/book" className="w-full"><Button className="w-full bg-blue-700 font-black h-14 rounded-2xl">BOOK NOW</Button></Link>
                <Link to="/login" className="w-full"><Button variant="outline" className="w-full border-blue-700 text-blue-700 font-black h-14 rounded-2xl">STAFF PORTAL</Button></Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img src={heroSlides[currentSlide].url} alt={heroSlides[currentSlide].title} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 text-center px-4 max-w-5xl">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center mb-6">
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
            </div>
          </motion.div>
          <motion.h1 key={`t-${currentSlide}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-9xl font-black text-white mb-6 leading-none tracking-tighter uppercase">
            {heroSlides[currentSlide].title}
          </motion.h1>
          <motion.p key={`s-${currentSlide}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-medium">
            {heroSlides[currentSlide].subtitle}
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book"><Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-xl px-12 h-16 font-black rounded-2xl shadow-2xl">RESERVE NOW</Button></Link>
            <a href="#gallery"><Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-slate-900 text-xl px-12 h-16 font-black rounded-2xl">EXPLORE GALLERY</Button></a>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">The Royal Experience</h2>
            <p className="text-slate-500 text-lg font-medium">Discover a sanctuary where luxury meets nature. Our resort is designed to provide an unforgettable escape from the ordinary.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4 group">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500"><Palmtree size={48} /></div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Lush Gardens</h3>
              <p className="text-slate-500 leading-relaxed">Acres of meticulously maintained tropical vegetation and serene walking paths for your peace of mind.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500"><BedDouble size={48} /></div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Luxury Suites</h3>
              <p className="text-slate-500 leading-relaxed">Experience the pinnacle of comfort with our premium bedding, garden views, and world-class amenities.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500"><Utensils size={48} /></div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Fine Dining</h3>
              <p className="text-slate-500 leading-relaxed">Authentic Ugandan delicacies and international gourmet cuisine served in our breathtaking garden setting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <Quote size={400} className="absolute -top-20 -left-20" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">Royal Voices</h2>
            <p className="text-slate-400 text-lg font-medium">What our distinguished guests have to say about their stay.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white/5 backdrop-blur-lg p-10 rounded-[3rem] border border-white/10">
                <Quote className="text-blue-500 mb-6" size={40} />
                <p className="text-xl text-slate-300 mb-8 italic font-medium">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-black uppercase tracking-tight">{t.name}</h4>
                    <p className="text-xs text-blue-500 font-black uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Find Paradise</h2>
                <p className="text-slate-500 text-lg font-medium">Located in the heart of Uganda's natural beauty, Royal Springs Resort is easily accessible yet worlds away.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={28} /></div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-slate-900">Our Address</h4>
                    <p className="text-slate-500">Royal Springs Resort, Kampala, Uganda</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Phone size={28} /></div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-slate-900">Call Us</h4>
                    <p className="text-slate-500">+256 772 514 889</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Mail size={28} /></div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-slate-900">Email Us</h4>
                    <p className="text-slate-500">info@royalspringsresort.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.8716362986!2d32.5138415!3d0.3136111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb91593c7867%3A0x3c8a33882516283!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
      <VoiceConcierge context="guest" />
    </div>
  );
};

export default Index;