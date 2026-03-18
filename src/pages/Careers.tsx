"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Briefcase, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const Careers: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });
      setJobs(data || []);
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="h-20 border-b px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Royal Springs Logo" className="h-12 object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline">Royal Springs Careers</span>
        </div>
        <Button variant="outline" onClick={() => navigate("/")} className="font-bold border-blue-600 text-blue-600">
          <ChevronLeft size={18} className="mr-1" /> Back to Resort
        </Button>
      </nav>

      <section className="bg-slate-900 text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Join Our Royal Team</h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto font-medium">
            Build your career at Uganda's premier luxury resort. We are always looking for passionate individuals to deliver excellence.
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl space-y-10">
        <div className="flex items-center justify-between border-b pb-6">
          <h2 className="text-3xl font-bold text-slate-900">Open Positions</h2>
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">{jobs.length} Roles Available</span>
        </div>

        {jobs.length > 0 ? (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="border-none shadow-lg hover:shadow-xl transition-all group rounded-3xl overflow-hidden">
                <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
                      <Briefcase size={16} /> {job.type}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-medium">
                      <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> Royal Springs Resort, Iganga</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> {job.department}</span>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 h-14 px-10 font-bold text-lg rounded-2xl shadow-lg shadow-blue-900/20 transition-transform active:scale-95">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Openings Right Now</h3>
            <p className="text-slate-500">We don't have any active job postings at the moment. Please check back soon!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Careers;