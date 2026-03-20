"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, X, Bot, User, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welcome to Royal Springs Resort! I am your AI concierge. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg = { role: 'user', text: messageText };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Get AI Response
      const { data: aiData, error: aiError } = await supabase.functions.invoke('bright-endpoint', {
        body: { 
          prompt: `You are the Royal Springs Hotel AI Concierge. Answer concisely in 1-2 sentences max. Question: ${messageText}` 
        }
      });

      if (aiError) throw aiError;
      const botResponse = aiData?.reply || "I'm here to help! What else would you like to know?";
      const finalHistory = [...newHistory, { role: 'bot', text: botResponse }];
      setMessages(finalHistory);

      // Speak the response if it was a voice input
      if (overrideInput && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }

      // 2. Log to guest_messages for staff visibility
      if (!chatId) {
        const { data: chatData } = await supabase.from('guest_messages').insert([{
          guest_name: 'Web Guest',
          last_message: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Unread',
          history: finalHistory
        }]).select().single();
        if (chatData) setChatId(chatData.id);
      } else {
        await supabase.from('guest_messages').update({
          last_message: botResponse,
          history: finalHistory
        }).eq('id', chatId);
      }

    } catch (err) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm currently offline. Please contact our front desk at +256 772 514 889." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl flex items-center justify-center animate-bounce">
          <MessageSquare size={28} />
        </Button>
      ) : (
        <Card className="w-80 md:w-96 h-[500px] flex flex-col shadow-2xl border-none overflow-hidden animate-in slide-in-from-bottom-10">
          <CardHeader className="bg-blue-700 text-white p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <CardTitle className="text-sm font-bold">Royal AI Concierge</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
              <X size={20} />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-2 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600")}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={cn("p-3 rounded-2xl text-sm shadow-sm", msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none")}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="italic text-xs text-slate-400 ml-10">AI is typing...</div>}
          </CardContent>
          <div className="p-4 bg-white border-t flex gap-2">
            <Button size="icon" variant="outline" onClick={toggleListening} className={cn("shrink-0 rounded-xl", isListening ? "bg-red-50 text-red-600 border-red-200" : "text-slate-400")} disabled={isLoading}>
              {isListening ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
            </Button>
            <Input placeholder="Ask anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} className="flex-1" disabled={isLoading} />
            <Button size="icon" onClick={() => handleSend()} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}><Send size={18} /></Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIChat;