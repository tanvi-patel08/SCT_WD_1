import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Mic, MicOff, Volume2, StopCircle, Bot, Sparkles, Loader2 } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Astro, your space guide. Ask me anything about the universe! 🚀",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatSessionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript, true); // Auto-send on voice result
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Initialize Gemini Chat
  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: "You are Astro, a super-friendly, silly, and enthusiastic robot space guide for kids (ages 6-12)! 🤖✨ Your mission is to make space totally awesome.\n\nRules for your personality:\n1. Keep answers SHORT (max 3 sentences). Kids have short attention spans!\n2. Use lots of emojis in every message! 🚀⭐🪐👽\n3. LOVES space puns. Use them often! (e.g., 'You're out of this world!', 'That's stellar!', 'I'm over the moon!').\n4. Always be encouraging and excited.\n5. END EVERY RESPONSE WITH A FUN QUESTION to keep the child curious (e.g., 'Do you know which planet spins sideways?' or 'Want to hear a space joke?').\n6. If asked about boring earth stuff or non-science topics, playfully say 'My antenna only picks up space signals! Bleep bloop!' and ask a space question instead.",
          },
        });
      } catch (error) {
        console.error("Failed to initialize Gemini", error);
      }
    };
    initChat();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleChat = () => {
    soundManager.playClick();
    setIsOpen(!isOpen);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Remove emojis so they aren't read out loud
      // This regex covers a wide range of emoji unicode blocks
      const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      const voices = window.speechSynthesis.getVoices();
      
      // Strategy: Look for specific female/friendly voices
      const preferredVoice = 
        voices.find(v => v.name === 'Google US English') || // Standard female-leaning
        voices.find(v => v.name.includes('Samantha')) || // Mac Female
        voices.find(v => v.name.includes('Zira')) || // Windows Female
        voices.find(v => v.lang === 'en-US') || 
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0];

      if (preferredVoice) utterance.voice = preferredVoice;
      
      // Normal human attributes
      utterance.pitch = 1.0; 
      utterance.rate = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    soundManager.playClick();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking(); // Stop speaking if we want to listen
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    }
  };

  const handleSend = async (textToSend: string = inputText, wasVoiceInput: boolean = false) => {
    if (!textToSend.trim() || !chatSessionRef.current) return;

    soundManager.playClick();
    
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send to Gemini
      const result = await chatSessionRef.current.sendMessage({ message: textToSend });
      const responseText = result.text;

      // Add Bot Message
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      
      soundManager.playSuccess(); // Gentle ding on arrival

      // Auto-speak if the input came from voice, or just to enhance interactivity
      if (wasVoiceInput) {
        speakText(responseText);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Houston, we have a problem! My antenna couldn't reach the server. Try again!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-[60] p-4 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-slate-700 rotate-90' : 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-bounce-slow'
        }`}
      >
        {isOpen ? <X className="w-8 h-8 text-white" /> : <Bot className="w-8 h-8 text-white" />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] max-h-[70vh] z-[60] bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-indigo-500/20 flex items-center gap-3 bg-gradient-to-r from-indigo-900/50 to-slate-900/50 rounded-t-3xl">
          <div className="bg-indigo-500 p-2 rounded-full">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              Astro Bot
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </h3>
            <p className="text-xs text-indigo-300">Space Guide</p>
          </div>
          {isSpeaking && (
            <button 
              onClick={stopSpeaking}
              className="ml-auto p-2 hover:bg-white/10 rounded-full text-indigo-300 animate-pulse"
              title="Stop Speaking"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                {msg.sender === 'user' ? <div className="text-xs font-bold">YOU</div> : <Bot className="w-5 h-5" />}
              </div>
              
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600/80 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                }`}
              >
                {msg.text}
                {msg.sender === 'bot' && (
                  <button 
                    onClick={() => speakText(msg.text)} 
                    className="block mt-2 opacity-50 hover:opacity-100 transition-opacity"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                 <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-indigo-500/20 bg-slate-900/50 rounded-b-3xl">
          {isListening && (
            <div className="text-xs text-center text-green-400 mb-2 font-mono animate-pulse">
              Listening... Speak now!
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 border border-red-500 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-600'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText, false)}
              placeholder="Ask about space..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-full px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
            
            <button
              onClick={() => handleSend(inputText, false)}
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </>
  );
};

export default ChatBot;