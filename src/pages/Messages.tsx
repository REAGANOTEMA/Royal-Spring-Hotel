"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { MessageSquare, Search, Send, User, Bot, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type MessageHistory = { role: "user" | "bot" | "staff"; text: string };
type Chat = {
  id: string;
  guest: string;
  lastMsg: string;
  time: string;
  status: string;
  history: MessageHistory[];
};

const Messages = () => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [reply, setReply] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const { data, error } = await supabase.from("guest_messages").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      const chats: Chat[] = data.map((row: any) => ({
        id: row.id,
        guest: row.guest_name,
        lastMsg: row.last_message,
        time: row.time,
        status: row.status,
        history: row.history || [],
      }));
      setMessages(chats);
      if (selectedChat) {
        const updated = chats.find(c => c.id === selectedChat.id);
        if (updated) setSelectedChat(updated);
      } else if (chats.length > 0) {
        setSelectedChat(chats[0]);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel("public:guest_messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "guest_messages" }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedChat?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.history]);

  const handleSend = async () => {
    if (!reply.trim() || !selectedChat) return;

    const updatedHistory = [...selectedChat.history, { role: "staff", text: reply }];
    
    const { error } = await supabase
      .from("guest_messages")
      .update({
        last_message: reply,
        status: "Replied",
        history: updatedHistory,
      })
      .eq("id", selectedChat.id);

    if (!error) {
      setReply("");
      fetchMessages();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Guest Inquiries Inbox</h2>
          <Badge className="bg-blue-100 text-blue-700 font-bold">
            {messages.filter((m) => m.status === "Unread").length} New
          </Badge>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 bg-white border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input className="pl-9 bg-slate-50 border-none" placeholder="Search guests..." />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {messages.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 border-b hover:bg-slate-50 transition-colors text-left",
                    selectedChat?.id === chat.id && "bg-blue-50 border-l-4 border-l-blue-600"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <User size={20} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 truncate">{chat.guest}</span>
                      <span className="text-[10px] text-slate-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-slate-50">
            {selectedChat ? (
              <>
                <div className="p-4 bg-white border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{selectedChat.guest}</h3>
                      <p className="text-xs text-green-600 flex items-center gap-1"><Clock size={12} /> Active</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedChat.history.map((msg, i) => (
                    <div key={i} className={cn("flex gap-3 max-w-[70%]", msg.role === "user" || msg.role === "bot" ? "mr-auto" : "ml-auto flex-row-reverse")}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === "staff" ? "bg-blue-600 text-white" : "bg-slate-200")}>
                        {msg.role === "staff" ? <Bot size={14} /> : <User size={14} />}
                      </div>
                      <div className={cn("p-3 rounded-2xl text-sm shadow-sm", msg.role === "staff" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none")}>
                        <p className="text-[10px] opacity-50 mb-1 uppercase font-bold">{msg.role}</p>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-white border-t flex gap-3">
                  <Input placeholder="Type your response..." value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="flex-1 h-12" />
                  <Button onClick={handleSend} className="bg-blue-700 hover:bg-blue-800 h-12 px-6 font-bold">
                    <Send size={18} className="mr-2" /> Send Reply
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Messages;