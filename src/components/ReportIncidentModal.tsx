"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (incident: any) => void;
}

const ReportIncidentModal = ({ isOpen, onClose, onSuccess }: ReportIncidentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Other',
    location: '',
    priority: 'Medium',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('incidents')
        .insert([{
          type: formData.type,
          description: `${formData.location}: ${formData.description}`,
          priority: formData.priority,
          status: 'Open',
          reported_by: localStorage.getItem('userName') || 'Staff',
          date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;

      showSuccess("Incident report submitted successfully!");
      if (onSuccess) onSuccess(data);
      setFormData({ type: 'Other', location: '', priority: 'Medium', description: '' });
      onClose();
    } catch (err: any) {
      showError(err.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Report New Incident</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Incident Type</Label>
            <Select onValueChange={(val) => setFormData({ ...formData, type: val })} value={formData.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Property Damage">Property Damage</SelectItem>
                <SelectItem value="Maintenance Issue">Maintenance Issue</SelectItem>
                <SelectItem value="Security Concern">Security Concern</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location (e.g. Room 204)</Label>
            <Input 
              id="location" 
              placeholder="Where did it happen?" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select onValueChange={(val) => setFormData({ ...formData, priority: val })} value={formData.priority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Provide details about the incident..." 
              className="min-h-[100px]" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required 
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIncidentModal;