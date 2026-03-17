"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { ImageIcon, Film, Plus, Trash2, Eye, Upload, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";

const Media = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMedia, setNewMedia] = useState({ type: "Image", title: "", url: "" });

  const fetchMedia = async () => {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setMedia(data || []);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async () => {
    if (!newMedia.title || !newMedia.url) return showError("Please provide a title and URL.");
    
    const { error } = await supabase.from('media').insert([newMedia]);
    
    if (error) {
      showError(error.message);
    } else {
      setIsDialogOpen(false);
      showSuccess("Media uploaded successfully.");
      setNewMedia({ type: "Image", title: "", url: "" });
      fetchMedia();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Media file deleted.");
      fetchMedia();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Media Library</h2>
          </div>
          <Button className="bg-blue-700 font-bold" onClick={() => setIsDialogOpen(true)}>
            <Upload size={18} className="mr-2" /> Upload Media
          </Button>
        </header>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-lg bg-white group">
              <div className="relative h-48 bg-slate-100">
                {item.type === "Video" ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}><Trash2 size={18} /></Button>
                </div>
                <Badge className="absolute top-3 left-3 bg-white/90 text-slate-900 font-bold">{item.type}</Badge>
              </div>
              <CardContent className="p-4">
                <p className="font-bold text-slate-900 truncate">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload Media</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={newMedia.title} onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })} placeholder="Enter title" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select 
                  value={newMedia.type} 
                  onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value })} 
                  className="w-full h-10 border rounded-md px-2 bg-white"
                >
                  <option value="Image">Image</option>
                  <option value="Video">Video</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={newMedia.url} onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })} placeholder="Paste image or video URL" />
              </div>
            </div>
            <DialogFooter><Button onClick={handleUpload} className="w-full bg-blue-700">Upload to Library</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <Footer />
      </main>
    </div>
  );
};

export default Media;