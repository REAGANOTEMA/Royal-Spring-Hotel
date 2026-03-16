"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { FileText, Upload, FileCheck, FileWarning, Search, Trash2, Eye, Download, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";

const initialDocs = [
  { id: "DOC-001", name: "May_Payroll_Summary.pdf", category: "HR", uploadedBy: "HR Manager", date: "2024-05-24", status: "Verified" },
  { id: "DOC-002", name: "Supplier_Invoice_FreshFoods.jpg", category: "Finance", uploadedBy: "GM", date: "2024-05-23", status: "Pending" },
  { id: "DOC-003", name: "Staff_Contract_Alice.pdf", category: "HR", uploadedBy: "Director", date: "2024-05-22", status: "Verified" },
  { id: "DOC-004", name: "Utility_Bill_May.png", category: "Finance", uploadedBy: "Staff", date: "2024-05-21", status: "Alert" },
];

const Help: React.FC = () => {
  const [docs, setDocs] = useState(initialDocs);

  const handleUpload = () => {
    showSuccess("Document uploaded and indexed for Director review.");
  };

  const handleDelete = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
    showSuccess("Document removed from system.");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Document Management Center</h2>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 font-bold flex items-center" onClick={handleUpload}>
            <Upload size={18} className="mr-2" /> Upload Paper Document
          </Button>
        </header>

        <div className="p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                  <FileCheck size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Docs</p>
                  <p className="text-2xl font-black">124</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</p>
                  <p className="text-2xl font-black">8</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                  <FileWarning size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expired/Alerts</p>
                  <p className="text-2xl font-black">3</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Table */}
          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-2xl">
            <CardHeader className="border-b px-8 py-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">System Files & Uploads</CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input className="pl-10 h-11 bg-slate-50 border-none" placeholder="Search documents..." />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Document Name</TableHead>
                    <TableHead className="font-bold">Category</TableHead>
                    <TableHead className="font-bold">Uploaded By</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docs.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-blue-600" />
                          <span className="font-bold text-slate-900">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">{doc.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{doc.uploadedBy}</TableCell>
                      <TableCell className="text-sm text-slate-500">{doc.date}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-3 py-1 font-bold rounded-full",
                          doc.status === "Verified" ? "bg-green-100 text-green-700" :
                          doc.status === "Pending" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-600"><Eye size={16} /></Button>
                          <Button variant="ghost" size="icon" className="text-slate-600"><Download size={16} /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(doc.id)}><Trash2 size={16} /></Button>
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

export default Help;