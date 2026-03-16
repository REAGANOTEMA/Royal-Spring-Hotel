"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welcome to Royal Springs Resort! I am your AI concierge. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI Response
    setTimeout(() => {
      let botResponse = "I'll check that for you. Would you like to speak with a human receptionist?";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('price') || lowerInput.includes('cost')) {
        botResponse = "Our rooms start at UGX 150,000 for Standard, UGX 250,000 for Deluxe, and UGX 450,000 for Suites.";
      } else if (lowerInput.includes('pool') || lowerInput.includes('swimming')) {
        botResponse = "Yes! We have a beautiful infinity pool open from 6:00 AM to 9:00 PM daily.";
      } else if (lowerInput.includes('food') || lowerInput.includes('restaurant')) {
        botResponse = "Our restaurant serves both local Ugandan delicacies and international cuisine 24/7.";
      } else if (lowerInput.includes('location') || lowerInput.includes('where')) {
        botResponse = "We are located in a serene environment surrounded by lush vegetation, perfect for relaxation.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl flex items-center justify-center animate-bounce"
        >
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
              <div key={i} className={cn(
                "flex gap-2 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"
                )}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm",
                  msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 bg-white border-t flex gap-2">
            <Input 
              placeholder="Ask anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIChat;