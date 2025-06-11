import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tone from 'tone';

// --- TYPE DEFINITIONS ---
// Defines the structure for a quick reply button
interface QuickReply {
  text: string;
  payload: string;
}

// Defines the structure for a single chat message
interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
  quickReplies?: QuickReply[];
}


// --- THE ENHANCED CHATBOT COMPONENT ---
const Chatbot: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSentWelcome, setHasSentWelcome] = useState(false);

  // --- REFS FOR SOUNDS & SCROLLING ---
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendSound = useRef<Tone.Synth | null>(null);
  const receiveSound = useRef<Tone.Synth | null>(null);

  // --- EFFECTS ---
  // Initialize sound effects on component mount
  // Note: Your project will need to have 'tone' installed (npm install tone)
  useEffect(() => {
    sendSound.current = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
    }).toDestination();
    receiveSound.current = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.2, sustain: 0.2, release: 1 },
    }).toDestination();
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // --- HELPER FUNCTIONS ---
  const getCurrentTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // --- CORE LOGIC ---
  // Sends a staggered, more engaging welcome message sequence
  const sendWelcomeSequence = () => {
    setIsTyping(true);
    setTimeout(() => { addBotMessage("Halo! 👋"); }, 800);
    setTimeout(() => { addBotMessage("Selamat datang di INOVYTE. Saya asisten virtual Anda."); }, 2000);
    setTimeout(() => {
        addBotMessage("Ada yang bisa saya bantu?", [
            { text: "Info Layanan", payload: "info_layanan" },
            { text: "Tentang Kami", payload: "info_tentang" },
            { text: "Kontak", payload: "info_kontak" }
        ]);
        setIsTyping(false);
    }, 3500);
  }

  // Opens/closes chat, triggering the welcome sequence on the first open
  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState && !hasSentWelcome) {
      sendWelcomeSequence();
      setHasSentWelcome(true);
    }
  };

  // Adds a new message from the bot to the chat
  const addBotMessage = (text: string, quickReplies?: QuickReply[]) => {
    receiveSound.current?.triggerAttackRelease("G4", "8n", Tone.now());
    const botMessage: Message = { id: Date.now(), text, sender: 'bot', timestamp: getCurrentTimestamp(), quickReplies };
    setMessages(prev => [...prev, botMessage]);
  };
  
  // Handles sending a message from user input or a quick reply
  const handleSendMessage = (text: string, payload?: string) => {
    const messageText = text.trim();
    if (messageText === '') return;

    sendSound.current?.triggerAttackRelease("C4", "8n", Tone.now());
    const userMessage: Message = { id: Date.now(), text: messageText, sender: 'user', timestamp: getCurrentTimestamp() };
    // Add user message and clear any existing quick replies
    setMessages(prev => [...prev.map(m => ({ ...m, quickReplies: undefined })), userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      getBotResponse(messageText, payload);
    }, 1500);
  };
  
  // Generates bot responses based on user input
  const getBotResponse = (userInput: string, payload?: string) => {
    const query = payload || userInput.toLowerCase();

    if (query.includes("harga") || query.includes("biaya")) {
      addBotMessage("Tentu! Untuk informasi harga, silakan jelaskan kebutuhan proyek Anda di halaman Kontak. Tim kami akan segera memberikan penawaran terbaik.");
    } else if (query.includes("info_layanan") || query.includes("layanan")) {
      addBotMessage("Kami menyediakan layanan Pengembangan Web, Layanan AI, dan Pengembangan IoT. Detail lengkapnya bisa Anda lihat pada bagian Layanan di halaman ini.");
    } else if (query.includes("info_kontak") || query.includes("kontak")) {
      addBotMessage("Anda dapat menghubungi kami melalui email di contact@inovyte.com atau telepon di +62 123 4567 890.");
    } else if (query.includes("info_tentang") || query.includes("tentang")) {
      addBotMessage("INOVYTE adalah partner teknologi yang berdedikasi mengubah ide brilian menjadi kenyataan, fokus pada pemberdayaan mahasiswa dan UMKM.");
    } else {
      addBotMessage("Maaf, saya belum mengerti. Bisa jelaskan lebih detail?", [
          { text: "Layanan kami", payload: "info_layanan" },
          { text: "Hubungi kami", payload: "info_kontak" }
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage(inputValue);
  };
  
  // Resets the conversation
  const clearChat = () => {
    setMessages([]);
    setHasSentWelcome(false);
    setTimeout(() => {
        sendWelcomeSequence();
        setHasSentWelcome(true);
    }, 500);
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
         <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={toggleChat}
            className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white p-4 rounded-full shadow-2xl shadow-cyan-500/30 flex items-center justify-center"
            aria-label="Toggle Chat" >
            <AnimatePresence mode="wait">
                <motion.div key={isOpen ? 'x' : 'msg'} initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }} transition={{ duration: 0.2 }} >
                  {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                </motion.div>
            </AnimatePresence>
          </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-sm h-[600px] max-h-[70vh] bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col border border-slate-700 z-[99] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900/80 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                 <div className="relative">
                     <Bot size={28} className="text-cyan-400" />
                     <span className="absolute top-0 right-0 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-slate-900"></span></span>
                 </div>
                <div>
                  <h3 className="font-bold text-white">INOVYTE Assistant</h3>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </div>
               <button onClick={clearChat} className="text-gray-400 hover:text-white transition-colors" title="Start a new conversation"><Trash2 size={20} /></button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} >
                    <div className={`flex items-end gap-2 text-sm ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] break-words rounded-2xl px-4 py-2.5 ${ msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-lg' : 'bg-slate-700 text-gray-200 rounded-bl-lg' }`}>
                          <p>{msg.text}</p>
                        </div>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1.5 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>{msg.timestamp}</p>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 justify-start">
                   <div className="rounded-2xl px-4 py-2.5 bg-slate-700 rounded-bl-lg">
                      <div className="flex items-center justify-center space-x-1 h-5">
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, delay: 0.1, repeat: Infinity }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      </div>
                   </div>
                </motion.div>
              )}
               {messages[messages.length - 1]?.quickReplies && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {messages[messages.length - 1].quickReplies?.map(qr => (
                        <motion.button key={qr.payload} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            onClick={() => handleSendMessage(qr.text, qr.payload)}
                            className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-cyan-300 text-xs font-medium py-1.5 px-3 rounded-full transition-colors"
                        > {qr.text} </motion.button>
                    ))}
                </div>
               )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-700 bg-slate-900/50 flex items-center gap-2 flex-shrink-0">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ketik pesan Anda..."
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all text-sm placeholder-gray-500" />
              <button onClick={() => handleSendMessage(inputValue)} className="bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0" disabled={!inputValue.trim()}>
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
