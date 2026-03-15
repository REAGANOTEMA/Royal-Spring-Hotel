"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { FileText, Book, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Help = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">System Documentation</h2>
        </header>

        <div className="p-8 space-y-8 max-w-4xl mx-auto w-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Book size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">User Training Manual</h1>
            <p className="text-slate-500">Everything you need to know about managing Royal Springs Resort ERP.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24} /></div>
                <div>
                  <h3 className="font-bold">Front Desk Guide</h3>
                  <p className="text-xs text-slate-500">Check-ins, bookings & billing</p>
                </div>
                <ChevronRight className="ml-auto text-slate-300" size={20} />
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Shield size={24} /></div>
                <div>
                  <h3 className="font-bold">Director's Manual</h3>
                  <p className="text-xs text-slate-500">Finance, HR & reporting</p>
                </div>
                <ChevronRight className="ml-auto text-slate-300" size={20} />
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle size={20} className="text-blue-600" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I record a guest check-in?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Bookings module, find the reservation, and click "Check In". The room status will automatically update to "Occupied".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How is the daily revenue calculated?</AccordionTrigger>
                  <AccordionContent>
                    The system automatically aggregates all paid invoices and recorded transactions from the Billing and Finance modules.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What happens when stock is low?</AccordionTrigger>
                  <AccordionContent>
                    The Inventory module will display a "Low Stock" or "Critical" badge, and an alert will be sent to the management dashboard.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Help;