"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Briefcase, Plus, Search, Globe, Eye, Trash2, Edit2, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  status: 'Draft' | 'Published';
  applicants: number;
  date: string;
  attachment?: File | null;
}

const initialJobs: Job[] = [
  { id: 'JOB-001', title: 'Front Desk Agent', department: 'Reception', type: 'Full-time', status: 'Published', applicants: 12, date: '2024-05-20' },
  { id: 'JOB-002', title: 'Sous Chef', department: 'Kitchen', type: 'Full-time', status: 'Draft', applicants: 0, date: '2024-05-22' },
  { id: 'JOB-003', title: 'Housekeeping Supervisor', department: 'Housekeeping', type: 'Full-time', status: 'Published', applicants: 5, date: '2024-05-18' },
];

const JobPostings = () => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Job>>({});

  // Open dialog for Add/Edit
  const openJobDialog = (job?: Job) => {
    if (job) setCurrentJob(job);
    else setCurrentJob({});
    setIsDialogOpen(true);
  };

  const handleSaveJob = () => {
    if (!currentJob.title || !currentJob.department || !currentJob.type) return;
    if (currentJob.id) {
      // Editing existing
      setJobs(prev => prev.map(j => (j.id === currentJob.id ? { ...j, ...currentJob } as Job : j)));
      showSuccess("Job updated successfully!");
    } else {
      // Adding new
      const newJob: Job = {
        ...(currentJob as Job),
        id: `JOB-00${jobs.length + 1}`,
        status: 'Draft',
        applicants: 0,
        date: new Date().toISOString().split('T')[0],
      };
      setJobs(prev => [...prev, newJob]);
      showSuccess("New job created!");
    }
    setIsDialogOpen(false);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    showSuccess("Job deleted successfully!");
  };

  const handlePublish = (id: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'Published' } : j));
    showSuccess("Job published successfully!");
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentJob({ ...currentJob, attachment: e.target.files[0] });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Recruitment & Job Postings</h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => openJobDialog()}>
            <Plus size={18} className="mr-2" /> Create New Job
          </Button>
        </header>

        <div className="p-8 space-y-6">
          {/* Search & Info */}
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

          {/* Job Table */}
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
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{job.title}</span>
                          <span className="text-xs text-slate-400">{job.id}</span>
                        </div>
                      </TableCell>
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
                        <Button variant="ghost" size="icon" title="View on Careers Page">
                          <Eye size={16} className="text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit Job" onClick={() => openJobDialog(job)}>
                          <Edit2 size={16} className="text-blue-600" />
                        </Button>
                        {job.status === 'Draft' && (
                          <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handlePublish(job.id)}>
                            Publish
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" title="Delete Job" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                        <label className="cursor-pointer">
                          <Input type="file" className="hidden" onChange={handleAttachmentChange} />
                          <UploadCloud size={16} className="text-purple-600" />
                        </label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Job Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentJob.id ? "Edit Job" : "Create New Job"}</DialogTitle>
            </DialogHeader>
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
                <Input value={currentJob.type || ''} onChange={e => setCurrentJob({ ...currentJob, type: e.target.value })} required />
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