"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { ImageIcon, Film, Plus, Trash2, Eye, Upload, Search, LayoutGrid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

type MediaItem = {
  id: string;
  type: "Image" | "Video";
  title: string;
  url: string;
  status: string;
};

const initialMedia: MediaItem[] = [
  { id: "MED-001", type: "Video", title: "Hero Background", url: "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-with-a-swimming-pool-and-palm-trees-42474-large.mp4", status: "Active" },
  { id: "MED-002", type: "Image", title: "Deluxe Suite View", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800", status: "Active" },
  { id: "MED-003", type: "Image", title: "Infinity Pool", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800", status: "Active" },
];

const Media = () => {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMedia, setNewMedia] = useState<{ type: "Image" | "Video"; title: string; url: string }>({ type: "Image", title: "", url: "" });

  const handleUpload = () => {
    if (!newMedia.title || !newMedia.url) return showError("Please provide a title and URL.");
    const id = `MED-${(media.length + 1).toString().padStart(3, "0")}`;
    setMedia([...media, { ...newMedia, id, status: "Active" }]);
    setNewMedia({ type: "Image", title: "", url: "" });
    setIsDialogOpen(false);
    showSuccess("Media uploaded successfully.");
  };

  const handleDelete = (id: string) => {
    setMedia(media.filter((m) => m.id !== id));
    showSuccess("Media file deleted.");
  };

  const handleEdit = (id: string, field: keyof MediaItem, value: string) => {
    setMedia(media.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
    showSuccess("Media updated.");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Media & Gallery Management</h2>
          </div>
          <Button className="bg-blue-700 hover:bg-blue-800 font-bold" onClick={() => setIsDialogOpen(true)}>
            <Upload size={18} className="mr-2" /> Upload New Media
          </Button>
        </header>

        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input className="pl-10 h-11 bg-white border-none shadow-sm" placeholder="Search media files..." />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon"><LayoutGrid size={18} /></Button>
              <Button variant="outline" size="icon"><List size={18} /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {media.map((item) => (
              <Card key={item.id} className="overflow-hidden border-none shadow-lg bg-white group">
                <div className="relative h-48 bg-slate-100">
                  {item.type === "Video" ? (
                    <video src={item.url} className="w-full h-full object-cover" muted controls />
                  ) : (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full" title="Preview"><Eye size={18} /></Button>
                    <Button size="icon" variant="destructive" className="h-10 w-10 rounded-full" onClick={() => handleDelete(item.id)} title="Delete"><Trash2 size={18} /></Button>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-white/90 text-slate-900 font-bold">
                    {item.type === "Video" ? <Film size={12} className="mr-1 inline" /> : <ImageIcon size={12} className="mr-1 inline" />}
                    {item.type}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <input
                    type="text"
                    value={item.title}
                    className="font-bold text-slate-900 w-full bg-transparent border-b border-slate-200 focus:border-blue-600 focus:outline-none"
                    onChange={(e) => handleEdit(item.id, "title", e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">{item.id} • {item.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Footer />
      </main>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Media Title</Label>
              <Input value={newMedia.title} onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })} placeholder="Enter title" />
            </div>
            <div className="space-y-2">
              <Label>Media Type</Label>
              <select value={newMedia.type} onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as "Image" | "Video" })} className="w-full h-10 border rounded-md px-2">
                <option value="Image">Image</option>
                <option value="Video">Video</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Media URL</Label>
              <Input value={newMedia.url} onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })} placeholder="Paste image/video URL here" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpload} className="w-full bg-blue-700">Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Media;