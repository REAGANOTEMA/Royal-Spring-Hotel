"use client";

import React, { useState, useEffect } from "react";
import { Hotel, MapPin, Clock, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const Careers: React.FC = () => {
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
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className="border-none shadow-md hover:shadow-lg transition-shadow group">
              <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
                    <Briefcase size={16} /> {job.type}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><MapPin size={14} /> Royal Springs Resort, Uganda</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {job.department}</span>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold">Apply Now</Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p>No open positions at the moment. Please check back later!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Careers;