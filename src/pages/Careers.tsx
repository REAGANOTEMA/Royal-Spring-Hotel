"use client";

import React from "react";
import { Hotel, MapPin, Clock, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

const jobs = [
  { 
    id: "1", 
    title: "Front Desk Agent", 
    location: "Royal Springs Resort, Uganda", 
    type: "Full-time", 
    salary: "UGX 800,000 - 1,200,000",
    desc: "We are looking for a professional Front Desk Agent to be the first point of contact for our guests."
  },
  { 
    id: "2", 
    title: "Housekeeping Supervisor", 
    location: "Royal Springs Resort, Uganda", 
    type: "Full-time", 
    salary: "UGX 900,000 - 1,100,000",
    desc: "Lead our housekeeping team to maintain the highest standards of cleanliness and guest satisfaction."
  }
];

const Careers: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": "Front Desk Agent",
    "description": "Professional Front Desk Agent for Royal Springs Resort...",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Royal Springs Resort",
      "sameAs": "https://royalspringsresort.com"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kampala",
        "addressRegion": "Central",
        "addressCountry": "UG"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Google Job Search Schema */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="h-20 border-b px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Hotel size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Royal Springs Careers</span>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>Back to Resort</Button>
      </nav>

      <section className="bg-slate-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Royal Team</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Build your career at Uganda's premier luxury resort. We are always looking for passionate individuals.
        </p>
      </section>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <h2 className="text-2xl font-bold text-slate-900">Open Positions</h2>
        {jobs.map((job) => (
          <Card key={job.id} className="border-none shadow-md hover:shadow-lg transition-shadow group">
            <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
                  <Briefcase size={16} /> {job.type}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> Posted 2 days ago</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{job.desc}</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold">Apply Now</Button>
            </CardContent>
          </Card>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Careers;