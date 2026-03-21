"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Menu, Palmtree, Utensils, BedDouble, Camera, Leaf, Waves, ShieldCheck, ChevronRight, Quote, MapPin, Phone, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import AdvancedVoiceConcierge from '@/components/AdvancedVoiceConcierge';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import ImageModal from '@/components/ImageModal';
import Attractions from '@/components/Attractions';
import Button3D from '@/components/Button3D';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Hero images - ALL images with "hero" in the name
const heroSlides = [
  {
    url: '/bed-hero.jpg',
    title: 'Royal Springs Resort',
    subtitle: 'Experience the pinnacle of Ugandan hospitality in a sanctuary of lush greenery and serene luxury.',
  },
  {
    url: '/bathroom-hero2.webp',
    title: 'Luxury Redefined',
    subtitle: '5-star standard bedding and masterfully designed suites for your ultimate comfort.',
  },
  {
    url: '/apartment-hero.JPG',
    title: 'Executive Living',
    subtitle: 'Spacious apartments with modern amenities for extended stays.',
  },
  {
    url: '/green-hero.JPG',
    title: 'Natural Serenity',
    subtitle: 'Surrounded by lush tropical gardens and pristine natural beauty.',
  },
  {
    url: '/hero-hotel-view.JPG',
    title: 'Resort Paradise',
    subtitle: 'A breathtaking panoramic view of our world-class resort facilities.',
  },
  {
    url: '/bedHhero1.jpg',
    title: 'Royal Comfort',
    subtitle: 'Experience unparalleled comfort in our premium bedding and luxury suites.',
  },
  {
    url: '/bedhero2.jpg',
    title: 'Elegant Living',
    subtitle: 'Sophisticated interiors and premium amenities for the discerning traveler.',
  },
];

// Gallery images - ALL remaining images from public folder
const galleryImages = [
  // Bedroom Images
  { src: '/bed-1.JPG', title: 'Royal Bed Suite', category: 'Rooms' },
  { src: '/bed-2.JPG', title: 'Executive Bedroom', category: 'Rooms' },
  { src: '/bed-4.JPG', title: 'Presidential Bedroom', category: 'Rooms' },
  { src: '/bed-5.JPG', title: 'Deluxe Bedroom', category: 'Rooms' },
  { src: '/bed-hero.jpg', title: 'Premium Bed Hero', category: 'Rooms' },
  { src: '/bed2.jpg', title: 'Deluxe Comfort', category: 'Rooms' },
  { src: '/bed4.jpg', title: 'Premium Bedding', category: 'Rooms' },
  { src: '/bedhero2.jpg', title: 'Cozy Bedroom', category: 'Rooms' },
  { src: '/bedHhero1.jpg', title: 'Royal Bedroom Suite', category: 'Rooms' },
  
  // Hotel Architecture
  { src: '/hero-hotel-view.JPG', title: 'Hotel Grand View', category: 'Architecture' },
  { src: '/hotel-house1.webp', title: 'Evening Ambiance', category: 'Resort' },
  { src: '/hotel-house2.webp', title: 'Tropical Gardens', category: 'Nature' },
  { src: '/hotel-house3.webp', title: 'Resort Entrance', category: 'Architecture' },
  { src: '/hotel-house4.webp', title: 'Garden Walkways', category: 'Nature' },
  { src: '/hotel-house5.webp', title: 'Fine Dining Area', category: 'Dining' },
  { src: '/hotel-house6.webp', title: 'Garden Terrace', category: 'Nature' },
  { src: '/hotel-house8.webp', title: 'Sunset Views', category: 'Resort' },
  { src: '/hotel-road.JPG', title: 'Resort Access Road', category: 'Architecture' },
  { src: '/hotel-view.JPG', title: 'Panoramic Hotel View', category: 'Architecture' },
  
  // Bathroom & Luxury
  { src: '/bathroom1.webp', title: 'Luxury Bathroom', category: 'Luxury' },
  { src: '/bathroom-hero2.webp', title: 'Premium Bath Suite', category: 'Luxury' },
  
  // Apartment Views
  { src: '/apartment-hero.JPG', title: 'Apartment Hero', category: 'Suites' },
  { src: '/apartment-view.JPG', title: 'Apartment View', category: 'Suites' },
  
  // Garden & Nature
  { src: '/cahir$table-in-garden1.JPG', title: 'Garden Dining', category: 'Dining' },
  { src: '/conference-room1.JPG', title: 'Conference Facilities', category: 'Business' },
  { src: '/free-garden.JPG', title: 'Free Garden Space', category: 'Nature' },
  { src: '/garden-greens.JPG', title: 'Lush Garden Greens', category: 'Nature' },
  { src: '/garden-view.JPG', title: 'Scenic Garden View', category: 'Nature' },
  { src: '/garden1.JPG', title: 'Tropical Garden', category: 'Nature' },
  { src: '/green-hero.JPG', title: 'Green Paradise', category: 'Nature' },
  
  // Road & Access
  { src: '/road-post.JPG', title: 'Scenic Road Post', category: 'Nature' },
  { src: '/road-to-apartment.JPG', title: 'Apartment Access', category: 'Architecture' },
  { src: '/road-view.JPG', title: 'Mountain Road View', category: 'Nature' },
  
  // Waterfalls & Water
  { src: '/water-spring.webp', title: 'The Water Spring', category: 'Amenities' },
  { src: '/waterfall1.JPG', title: 'Waterfall Paradise', category: 'Nature' },
  { src: '/waterfall2.JPG', title: 'Crystal Waterfall', category: 'Nature' },
  { src: '/waterfall3.JPG', title: 'Serene Waterfall', category: 'Nature' },
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
    text: "World-class service and impeccable attention to detail. Royal Springs is my home in Iganga.",
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
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Show install prompt after user scrolls a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !showInstallPrompt) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showInstallPrompt]);

  // Handle modal navigation
  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  const goToPreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < galleryImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

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
          <motion.h1 key={`t-${currentSlide}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-8xl font-black text-white mb-6 leading-none tracking-tighter uppercase">
            {heroSlides[currentSlide].title}
          </motion.h1>
          <motion.p key={`s-${currentSlide}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-medium">
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

      {/* Hotel Standards Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Hospitality Standards</h2>
            <p className="text-slate-500 text-lg">Dedicated to world-class comfort in beddings, food, snacks and pool leisure for every Royal Springs guest.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-black text-slate-900 mb-3">Bedding Standards</h3>
              <p className="text-slate-600 mb-4">Egyptian cotton linens, hypoallergenic pillows, and nightly turndown service for a royal sleep.</p>
              <img src="/bed-2.JPG" alt="Luxury Bedding" className="rounded-2xl w-full h-48 object-cover" />
            </div>
            <div className="border p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-black text-slate-900 mb-3">Gourmet Cuisine</h3>
              <p className="text-slate-600 mb-4">24/7 chef-driven menus featuring seasonal Ugandan specialties and international favorites.</p>
              <img src="/cahir$table-in-garden1.JPG" alt="Gourmet Food" className="rounded-2xl w-full h-48 object-cover" />
            </div>
            <div className="border p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-black text-slate-900 mb-3">Perfect Leisure</h3>
              <p className="text-slate-600 mb-4">Temperature-controlled pool and poolside cabanas set for a resort-grade experience.</p>
              <img src="/waterfall2.JPG" alt="Swimming Pool" className="rounded-2xl w-full h-48 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Photo Gallery</h2>
            <p className="text-slate-500 text-lg font-medium">Explore the beauty and elegance of Royal Springs Resort through our curated collection.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal(index)}
                className="group relative h-72 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-400/20 px-2 py-1 rounded-full">
                        {image.category}
                      </span>
                      <span className="text-xs text-white/80">
                        {index + 1} of {galleryImages.length}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white leading-tight">
                      {image.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <Camera size={14} />
                      <span>Click to view full size</span>
                    </div>
                  </div>
                </div>
                
                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/50 rounded-xl transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Showcase Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Luxury Rooms & Suites</h2>
            <p className="text-slate-500 text-lg font-medium">Experience unparalleled comfort in our meticulously designed accommodations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative h-96 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/bed-hero.jpg" alt="Royal Master Suite" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Master Suite</p>
                  <h3 className="text-2xl font-black text-white">Royal Excellence</h3>
                </div>
              </div>
            </div>
            <div className="group relative h-96 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/bed-1.JPG" alt="Royal Bed Suite" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Deluxe</p>
                  <h3 className="text-2xl font-black text-white">Premium Comfort</h3>
                </div>
              </div>
            </div>
            <div className="group relative h-96 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/bed-4.JPG" alt="Presidential Bedroom" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Presidential</p>
                  <h3 className="text-2xl font-black text-white">Ultimate Luxury</h3>
                </div>
              </div>
            </div>
            <div className="group relative h-96 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/apartment-hero.JPG" alt="Apartment Living" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Apartment</p>
                  <h3 className="text-2xl font-black text-white">Extended Stay</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gardens & Nature Section */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Tropical Gardens</h2>
            <p className="text-slate-500 text-lg font-medium">Immerse yourself in the breathtaking natural beauty of our curated landscapes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative h-80 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/garden-greens.JPG" alt="Lush Garden Greens" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Nature</p>
                  <h3 className="text-2xl font-black text-white">Lush Greens</h3>
                </div>
              </div>
            </div>
            <div className="group relative h-80 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/free-garden.JPG" alt="Free Garden Space" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Recreation</p>
                  <h3 className="text-2xl font-black text-white">Open Spaces</h3>
                </div>
              </div>
            </div>
            <div className="group relative h-80 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/green-hero.JPG" alt="Green Paradise" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Paradise</p>
                  <h3 className="text-2xl font-black text-white">Green Haven</h3>
                </div>
              </div>
            </div>
            <div className="group relative h-80 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/garden-view.JPG" alt="Scenic Garden View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Scenic</p>
                  <h3 className="text-2xl font-black text-white">Garden Views</h3>
                </div>
              </div>
            </div>
            <div className="group relative h-80 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/garden1.JPG" alt="Tropical Garden" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Tropical</p>
                  <h3 className="text-2xl font-black text-white">Exotic Flora</h3>
                </div>
              </div>
            </div>
            <div className="group relative h-80 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/cahir$table-in-garden1.JPG" alt="Garden Dining" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Dining</p>
                  <h3 className="text-2xl font-black text-white">Al Fresco</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waterfalls Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Natural Waterfalls</h2>
            <p className="text-slate-500 text-lg font-medium">Discover the mesmerizing waterfalls that surround our resort paradise.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group relative h-96 rounded-[2rem] overflow-hidden shadow-xl lg:col-span-2">
              <img src="/waterfall1.JPG" alt="Waterfall Paradise" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Main Attraction</p>
                  <h3 className="text-3xl font-black text-white">Paradise Falls</h3>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="group relative h-44 rounded-[2rem] overflow-hidden shadow-xl">
                <img src="/waterfall2.JPG" alt="Crystal Waterfall" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Crystal</p>
                    <h3 className="text-xl font-black text-white">Pure Waters</h3>
                  </div>
                </div>
              </div>
              <div className="group relative h-44 rounded-[2rem] overflow-hidden shadow-xl">
                <img src="/waterfall3.JPG" alt="Serene Waterfall" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Serene</p>
                    <h3 className="text-xl font-black text-white">Peaceful Falls</h3>
                  </div>
                </div>
              </div>
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
                <p className="text-slate-500 text-lg font-medium">Located in the heart of Iganga, Royal Springs Resort is easily accessible yet worlds away.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={28} /></div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-slate-900">Our Address</h4>
                    <p className="text-slate-500">Iganga, after Nakalama trading center along Tororo road</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Phone size={28} /></div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-slate-900">Call Us</h4>
                    <p className="text-slate-500">+256 772 572 645</p>
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
            <div className="h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 relative group">
              {/* Map Container with Perfect Pin */}
              <div className="w-full h-full relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.823456!2d33.987654!3d0.345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177d5a8c89abcd%3A0x123456789abcdef!2sRoyal%20Springs%20Resort%2C%20Iganga%2C%20Uganda!5e0!3m2!1sen!2sus!4v1711000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Royal Springs Resort Location - Iganga, Uganda"
                />
                
                {/* Info Card on Hover */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white rounded-xl shadow-xl p-4 border-2 border-red-500 max-w-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">Royal Springs Resort</h4>
                        <p className="text-xs text-slate-600 mt-1">Iganga, After Nakalama TC<br/>Along Tororo Road</p>
                        <a 
                          href="https://maps.app.goo.gl/kAZjUNXLFt4kxZ349" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 font-bold mt-2 inline-block hover:text-blue-800"
                        >
                          Open in Google Maps ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AdvancedVoiceConcierge context="guest" />
      {showInstallPrompt && (
        <PWAInstallPrompt onClose={() => setShowInstallPrompt(false)} />
      )}
      
      {/* Image Modal */}
      {isModalOpen && selectedImageIndex !== null && (
        <ImageModal
          image={galleryImages[selectedImageIndex]}
          isOpen={isModalOpen}
          onClose={closeModal}
          onPrevious={goToPreviousImage}
          onNext={goToNextImage}
          currentIndex={selectedImageIndex}
          totalImages={galleryImages.length}
        />
      )}
    </div>
  );
};

export default Index;