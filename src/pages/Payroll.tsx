"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Banknote, Wallet, TrendingDown, TrendingUp, Plus, Search, Download, Calculator, Printer, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const Payroll = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [payrollData, setPayrollData] = useState({ salary: '', advance: '', deduction: '' });

  const fetchStaff = async () => {
    const { data, error } = await supabase.from('staff').select('*').order('name');
    if (error) showError(error.message);
    else setStaff(data || []);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleUpdatePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const salary = parseFloat(payrollData.salary || '0');
    const advance = parseFloat(payrollData.advance || '0');
    const deduction = parseFloat(payrollData.deduction || '0');
    const net = salary - advance - deduction;

    const { error } = await supabase
      .from('staff')
      .update({
        salary: salary.toString(),
        advance: advance.toString(),
        deduction: deduction.toString(),
        net: net.toString()
      })
      .eq('id', selectedStaff.id);

    if (error) {
      showError(error.message);
    } else {
      showSuccess(`Payroll updated for ${selectedStaff.name}`);
      setIsModalOpen(false);
      fetchStaff();
    }
  };

  const handlePrintPayslip = (s: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip - ${s.name}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 50px; color: #1e293b; }
            .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { height: 80px; margin-bottom: 10px; }
            .title { font-size: 28px; font-weight: 900; color: #1e3a8a; margin: 0; }
            .subtitle { font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
            .info-grid { display: grid; grid-cols: 2; gap: 20px; margin-bottom: 40px; }
            .info-box { padding: 20px; background: #f8fafc; border-radius: 15px; }
            .label { font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px; }
            .value { font-size: 16px; font-weight: 700; color: #1e293b; }
            .ledger { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .ledger th { text-align: left; padding: 15px; background: #1e3a8a; color: white; font-size: 12px; text-transform: uppercase; }
            .ledger td { padding: 15px; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
            .total-row { background: #f1f5f9; font-size: 20px; font-weight: 900; }
            .footer { text-align: center; margin-top: 60px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; pt: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/logo.png" class="logo" />
            <h1 class="title">ROYAL SPRINGS RESORT</h1>
            <p class="subtitle">Official Salary Payslip</p>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div class="info-box" style="flex: 1; margin-right: 20px;">
              <div class="label">Employee Name</div>
              <div class="value">${s.name}</div>
              <div class="label" style="margin-top: 15px;">Designation</div>
              <div class="value">${s.role.toUpperCase()}</div>
            </div>
            <div class="info-box" style="flex: 1;">
              <div class="label">Pay Period</div>
              <div class="value">${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
              <div class="label" style="margin-top: 15px;">Employee ID</div>
              <div class="value">${s.id.slice(0, 8).toUpperCase()}</div>
            </div>
          </div>
          <table class="ledger">
            <thead>
              <tr><th>Description</th><th style="text-align: right;">Amount (UGX)</th></tr>
            </thead>
            <tbody>
              <tr><td>Basic Salary</td><td style="text-align: right;">${parseFloat(s.salary).toLocaleString()}</td></tr>
              <tr><td style="color: #dc2626;">Salary Advance</td><td style="text-align: right; color: #dc2626;">-${parseFloat(s.advance).toLocaleString()}</td></tr>
              <tr><td style="color: #dc2626;">Other Deductions</td><td style="text-align: right; color: #dc2626;">-${parseFloat(s.deduction).toLocaleString()}</td></tr>
              <tr class="total-row"><td>NET PAYABLE</td><td style="text-align: right; color: #1e3a8a;">UGX ${parseFloat(s.net).toLocaleString()}</td></tr>
            </tbody>
          </table>
          <div class="footer">
            <p>This is a computer-generated document and does not require a physical signature.</p>
            <p>Royal Springs Resort | Kampala, Uganda | +256 772 514 889</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/20">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Payroll & Compensation</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Financial Operations</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-black h-12 rounded-xl border-slate-200" onClick={() => window.print()}>
              <Download size={18} className="mr-2" /> EXPORT PAYROLL
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl"><Wallet size={32} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Monthly Payroll</p>
                  <h3 className="text-2xl font-black text-slate-900">
                    UGX {staff.reduce((acc, s) => acc + parseFloat(s.net || '0'), 0).toLocaleString()}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-amber-50 text-amber-600 rounded-2xl"><TrendingDown size={32} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Advances</p>
                  <h3 className="text-2xl font-black text-amber-600">
                    UGX {staff.reduce((acc, s) => acc + parseFloat(s.advance || '0'), 0).toLocaleString()}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-white/10 rounded-2xl"><TrendingUp size={32} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Staff Count</p>
                  <h3 className="text-2xl font-black">{staff.length} Active</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2.5rem]">
            <CardHeader className="border-b px-8 py-6">
              <CardTitle className="text-xl font-black">Staff Payroll Ledger</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Staff Member</TableHead>
                    <TableHead className="font-bold">Role</TableHead>
                    <TableHead className="text-right font-bold">Base Salary</TableHead>
                    <TableHead className="text-right font-bold">Advances</TableHead>
                    <TableHead className="text-right font-bold">Net Payable</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 font-bold text-slate-900">{s.name}</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold rounded-lg">{s.role}</Badge></TableCell>
                      <TableCell className="text-right font-bold">UGX {parseFloat(s.salary || '0').toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold text-red-600">-UGX {parseFloat(s.advance || '0').toLocaleString()}</TableCell>
                      <TableCell className="text-right font-black text-blue-700">UGX {parseFloat(s.net || '0').toLocaleString()}</TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50 rounded-xl" onClick={() => handlePrintPayslip(s)}>
                            <Printer size={18} />
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 hover:border-blue-600 hover:text-blue-600" onClick={() => { setSelectedStaff(s); setPayrollData({ salary: s.salary, advance: s.advance, deduction: s.deduction }); setIsModalOpen(true); }}>
                            Adjust
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="rounded-[2.5rem] max-w-md">
            <DialogHeader><DialogTitle className="text-2xl font-black">Adjust Payroll: {selectedStaff?.name}</DialogTitle></DialogHeader>
            <form onSubmit={handleUpdatePayroll} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Base Salary (UGX)</Label>
                <Input type="number" value={payrollData.salary} onChange={e => setPayrollData({...payrollData, salary: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Advances (UGX)</Label>
                  <Input type="number" value={payrollData.advance} onChange={e => setPayrollData({...payrollData, advance: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Deductions (UGX)</Label>
                  <Input type="number" value={payrollData.deduction} onChange={e => setPayrollData({...payrollData, deduction: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-700 h-14 rounded-2xl font-black shadow-xl shadow-blue-900/20">UPDATE PAYROLL</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
};

export default Payroll;