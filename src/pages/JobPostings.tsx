"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Briefcase, Plus, Search, Globe, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { showSuccess } from '@/utils/toast';

const initialJobs = [
  { id: 'JOB-001', title: 'Front Desk Agent', department: 'Reception', type: 'Full-time', status: 'Published', applicants: 12, date: '2024-05-20' },
  { id: 'JOB-002', title: 'Sous Chef', department: 'Kitchen', type: 'Full-time', status: 'Draft', applicants: 0, date: '2024-05-22' },
  { id: 'JOB-003', title: 'Housekeeping Supervisor', department: 'Housekeeping', type: 'Full-time', status: 'Published', applicants: 5, date: '2024-05-18' },
];

const JobPostings = () => {
  const [jobs, setJobs] = useState(initialJobs);

  const handlePublish = (id: string) => {
    showSuccess("Job posting published to Google and Careers page!");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Recruitment & Job Postings</h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
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
                    <TableHead className="font-bold">Job Title</TableHead>
                    <TableHead className="font-bold">Department</TableHead>
                    <TableHead className="font-bold">Type</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-center">Applicants</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
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
                        )}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">{job.applicants}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View on Careers Page">
                            <Eye size={16} className="text-slate-600" />
                          </Button>
                          {job.status === 'Draft' && (
                            <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handlePublish(job.id)}>
                              Publish
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default JobPostings;