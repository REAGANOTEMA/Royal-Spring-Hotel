"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Briefcase, Plus, Search, Globe, Eye, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  status: string;
  applicants: number;
  created_at: string;
}

const JobPostings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Job>>({});

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) showError(error.message);
    else setJobs(data as Job[]);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveJob = async () => {
    if (!currentJob.title || !currentJob.department || !currentJob.type) return;
    
    if (currentJob.id) {
      const { error } = await supabase.from('jobs').update(currentJob).eq('id', currentJob.id);
      if (error) showError(error.message);
      else showSuccess("Job updated successfully!");
    } else {
      const { error } = await supabase.from('jobs').insert([currentJob]);
      if (error) showError(error.message);
      else showSuccess("New job created!");
    }
    setIsDialogOpen(false);
    fetchJobs();
  };

  const handleDeleteJob = async (id: string) => {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) showError(error.message);
    else {
      showSuccess("Job deleted successfully!");
      fetchJobs();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Recruitment & Job Postings</h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setCurrentJob({}); setIsDialogOpen(true); }}>
            <Plus size={18} className="mr-2" /> Create New Job
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input className="pl-10 bg-white" placeholder="Search job titles..." />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Globe size={16} className="text-green-500" />
              <span>All published jobs are automatically indexed by Google</span>
            </div>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Applicants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map(job => (
                    <TableRow key={job.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-semibold">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-2 py-0.5",
                          job.status === 'Published' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                        )}>{job.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">{job.applicants}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setCurrentJob(job); setIsDialogOpen(true); }}>
                          <Edit2 size={16} className="text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{currentJob.id ? "Edit Job" : "Create New Job"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={currentJob.title || ''} onChange={e => setCurrentJob({ ...currentJob, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={currentJob.department || ''} onChange={e => setCurrentJob({ ...currentJob, department: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Input value={currentJob.type || ''} onChange={e => setCurrentJob({ ...currentJob, type: e.target.value })} placeholder="e.g. Full-time" required />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select 
                  value={currentJob.status || 'Draft'} 
                  onChange={e => setCurrentJob({ ...currentJob, status: e.target.value })}
                  className="w-full h-10 border rounded-md px-2"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <DialogFooter>
                <Button className="w-full bg-blue-600" onClick={handleSaveJob}>
                  {currentJob.id ? "Update Job" : "Create Job"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
        <Footer />
      </main>
    </div>
  );
};

export default JobPostings;