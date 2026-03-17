"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import ReportIncidentModal from '@/components/ReportIncidentModal';
import DeleteDialog from '@/components/DeleteDialog';
import { Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

interface Incident {
  id: string;
  type: string;
  description: string;
  reported_by: string;
  date: string;
  priority: string;
  status: string;
}

const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setIncidents(data as Incident[]);
    } catch (err: any) {
      console.error('Error fetching incidents:', err.message);
      showError('Failed to load incidents.');
    }
  };

  useEffect(() => {
    fetchIncidents();

    const subscription = supabase
      .channel('public:incidents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        fetchIncidents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const { error } = await supabase.from('incidents').delete().eq('id', selectedId);
      if (error) throw error;
      setIncidents(incidents.filter(i => i.id !== selectedId));
      showSuccess('Incident report deleted.');
    } catch (err: any) {
      console.error('Error deleting incident:', err.message);
      showError('Failed to delete incident.');
    }
    setIsDeleteModalOpen(false);
  };

  const handleNewIncident = (incident: Incident) => {
    setIncidents([incident, ...incidents]);
    showSuccess('Incident reported successfully.');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Incident Reports</h2>
          <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Report Incident
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell className="font-medium text-slate-500">{inc.id}</TableCell>
                      <TableCell><Badge variant="outline">{inc.type}</Badge></TableCell>
                      <TableCell className="max-w-xs truncate">{inc.description}</TableCell>
                      <TableCell>
                        <Badge className={inc.status === 'Open' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
                          {inc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500"
                          onClick={() => { setSelectedId(inc.id); setIsDeleteModalOpen(true); }}>
                          <Trash2 size={16} />
                        </Button>
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

      <ReportIncidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleNewIncident} 
      />
      <DeleteDialog 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
      />
    </div>
  );
};

export default Incidents;