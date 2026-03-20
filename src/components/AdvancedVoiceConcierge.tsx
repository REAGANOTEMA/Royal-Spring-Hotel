/**
 * Advanced Voice Concierge with Real-Time Speech Recognition & Recording
 * Royal Springs Hotel - AI Voice Assistant with recording capability
 */

"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Radio, Square, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface VoiceCommandResult {
  success: boolean;
  message: string;
  action?: string;
}

interface AdvancedVoiceConciergeProps {
  context?: 'guest' | 'staff';
  userName?: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

/** ==========================================
 * ADVANCED VOICE CONCIERGE COMPONENT
 * ========================================== */

const AdvancedVoiceConcierge = ({ context = 'guest', userName }: AdvancedVoiceConciergeProps) => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // ==========================================
  // Initialize Speech Recognition
  // ==========================================
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('[Voice] Recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setRecognizedText(transcript);
          handleVoiceCommand(transcript);
        } else {
          interim += transcript;
        }
      }
      if (interim) setRecognizedText(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('[Voice] Recognition error:', event.error);
      if (event.error !== 'no-speech') {
        showError(`Voice Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('[Voice] Recognition ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  // ==========================================
  // Text-to-Speech Function
  // ==========================================
  const speak = useCallback((text: string) => {
    if (!isTTSEnabled) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes('Google UK English Male') ||
        v.name.includes('Daniel') ||
        v.name.includes('Moira')
    );

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.0;
    utterance.rate = 0.95;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
    setResponseText(text);
  }, [isTTSEnabled]);

  const queryChatGPT = useCallback(async (prompt: string) => {
    try {
      const { data, error } = await (window as any).supabase.functions.invoke('bright-endpoint', {
        body: { 
          prompt: `You are the Royal Springs Hotel AI Concierge. Answer concisely in 1-2 sentences max. Question: ${prompt}` 
        }
      });
      if (error) {
        console.error('ChatGPT service error', error);
        return 'I am sorry, the assistant service is unavailable right now.';
      }
      return data?.reply || 'I am ready to answer any question you have.';
    } catch (err) {
      console.error('ChatGPT error', err);
      return 'I am unable to reach the AI service at the moment.';
    }
  }, []);

  // ==========================================
  // Voice Command Processing
  // ==========================================
  const handleVoiceCommand = useCallback(
    async (transcript: string) => {
      const lowerTranscript = transcript.toLowerCase().trim();
      setCommandHistory((prev) => [...prev.slice(-3), lowerTranscript]); // Reduced history size

      console.log('[Voice Command]', lowerTranscript);
      
      // Simple direct answers for common queries to be ultra-fast
      const quickAnswers: Record<string, string> = {
        'location': 'We are located in Iganga, past Nakalama on Tororo road.',
        'address': 'We are located in Iganga, past Nakalama on Tororo road.',
        'directions': 'We are located in Iganga, past Nakalama on Tororo road.',
        'bye': 'Goodbye! Have a wonderful stay at Royal Springs.',
        'goodbye': 'Goodbye! Have a wonderful stay at Royal Springs.',
        'exit': 'Goodbye! Have a wonderful stay at Royal Springs.',
      };

      if (quickAnswers[lowerTranscript]) {
        speak(quickAnswers[lowerTranscript]);
        if (lowerTranscript.includes('bye') || lowerTranscript.includes('exit')) stopListening();
        return;
      }

      // For everything else, use AI but keep it very precise
      const aiReply = await queryChatGPT(transcript);
      speak(aiReply);
    },
    [queryChatGPT, speak, stopListening]
  );

  // ==========================================
  // Recording Functionality
  // ==========================================
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio visualization
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;

      source.connect(analyzer);
      analyzerRef.current = analyzer;

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        console.log('[Recording] Audio blob created:', blob.size, 'bytes');
        
        // Stop stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      showSuccess('Recording started');

      // Animate voice level
      const updateVoiceLevel = () => {
        if (!analyzerRef.current || !isRecording) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVoiceLevel(Math.min(100, (average / 255) * 100));

        animationRef.current = requestAnimationFrame(updateVoiceLevel);
      };

      updateVoiceLevel();
    } catch (err) {
      console.error('[Recording Error]', err);
      showError('Could not access microphone');
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      setVoiceLevel(0);
      showSuccess('Recording stopped');
    }
  }, [isRecording]);

  // ==========================================
  // Voice Control Functions
  // ==========================================
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setRecognizedText('');
      setResponseText('');
      recognitionRef.current.start();
      speak('I am listening. Please say a command.');
    }
  }, [isListening, speak]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Initialize welcome message
  useEffect(() => {
    if (isTTSEnabled && !hasWelcomed) {
      const welcomeMsg =
        context === 'guest'
          ? 'Welcome to Royal Springs Resort. I am your AI voice assistant. Say help to get started.'
          : `Welcome to the Command Center, ${userName || 'Executive'}. Voice assistance is ready.`;
      
      const timer = setTimeout(() => {
        speak(welcomeMsg);
        setHasWelcomed(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isTTSEnabled, hasWelcomed, context, userName, speak]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {/* Voice Status Card */}
      {(isListening || isRecording) && (
        <Card className="p-4 bg-white shadow-2xl border-2 border-blue-500 rounded-2xl max-w-xs">
          <div className="space-y-3">
            {/* Voice Level Indicator */}
            {isRecording && (
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-700 uppercase">Voice Level</p>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all"
                    style={{ width: `${voiceLevel}%` }}
                  />
                </div>
              </div>
            )}

            {/* Recognized Text */}
            {recognizedText && (
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-700 uppercase">You said:</p>
                <p className="text-sm text-slate-600 italic">{recognizedText}</p>
              </div>
            )}

            {/* Response Text */}
            {responseText && (
              <div className="space-y-2 border-t pt-3">
                <p className="text-xs font-black text-slate-700 uppercase">Response:</p>
                <p className="text-sm text-slate-600">{responseText}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Control Buttons */}
      <div className="flex gap-2 flex-col-reverse">
        {/* TTS Toggle */}
        <Button
          onClick={() => setIsTTSEnabled(!isTTSEnabled)}
          className={cn(
            'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all',
            isTTSEnabled
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-slate-800 hover:bg-slate-700'
          )}
          title={isTTSEnabled ? 'Disable voice' : 'Enable voice'}
        >
          {isTTSEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </Button>

        {/* Recording Toggle */}
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={cn(
            'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all',
            isRecording
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700'
          )}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <Square size={24} /> : <Mic size={24} />}
        </Button>

        {/* Listening Toggle */}
        <Button
          onClick={isListening ? stopListening : startListening}
          className={cn(
            'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all',
            isListening
              ? 'bg-green-600 hover:bg-green-700 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700'
          )}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? <Radio size={24} className="animate-spin" /> : <MicOff size={24} />}
        </Button>
      </div>

      {/* Status Badge */}
      <div className="text-right text-xs font-black text-slate-500">
        {isListening && <p className="text-green-600">🎤 Listening...</p>}
        {isRecording && <p className="text-red-600">⏺️ Recording...</p>}
        {isTTSEnabled && !isListening && !isRecording && (
          <p className="text-blue-600">🔊 Voice Active</p>
        )}
      </div>
    </div>
  );
};

// ==========================================
// Hook for using voice in other components
// ==========================================
export const useAdvancedVoice = () => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);

  const speak = useCallback((text: string) => {
    if (!isTTSEnabled) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes('Google UK English Male') ||
        v.name.includes('Daniel') ||
        v.name.includes('Moira')
    );

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.0;
    utterance.rate = 0.95;

    window.speechSynthesis.speak(utterance);
  }, [isTTSEnabled]);

  return { speak, isTTSEnabled, setIsTTSEnabled };
};

export default AdvancedVoiceConcierge;
