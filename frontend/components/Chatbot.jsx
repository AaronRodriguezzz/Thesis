import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, X } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import DOMPurify from "dompurify";
import useScrollDetect from '../hooks/useScrollDetect';

const Chatbot = () => {
  const scrollIsMax = useScrollDetect();
  const messagesEndRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);

  const handleSend = async () => {
    if (!input.trim() || waiting) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setWaiting(true);

    try {
      const response = await axios.post('/api/chatbot', { prompt: input.trim() });

      if (response.status === 200 && response.data.message) {
        setTimeout(() => {
          const botReply = { sender: 'bot', text: response.data.message };
          setMessages(prev => [...prev, botReply]);
          setWaiting(false);
        }, 500);
        setInput('');
      }
    } catch (err) {
      console.log(err);
      setWaiting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{
        y: scrollIsMax ? -70 : 0,
        opacity: 1,
      }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed right-4 bottom-5 z-50 flex flex-col items-end gap-3"
    >
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-[320px] h-[520px] bg-black/40 backdrop-blur-md shadow-lg shadow-white/20 rounded-2xl flex flex-col overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="bg-black/50 text-white px-4 py-3 flex justify-between items-center border-b border-white/20">
            <span className="font-semibold text-lg tracking-tight">💈 BarberBot</span>
            <button
              onClick={() => setOpen(false)}
              className="hover:text-gray-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' ? (
                  <>
                    <Bot className="w-5 h-5 text-white/70" />
                    <div
                      className="p-3 rounded-xl max-w-[75%] bg-white/10 backdrop-blur-sm text-sm text-white shadow shadow-white/10"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(msg.text.replace(/```html|```/g, "").trim())
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-xl max-w-[75%] bg-white text-black text-sm shadow shadow-white/20">
                      {msg.text}
                    </div>
                    <User className="w-5 h-5 text-white/70" />
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-white/20 bg-black/50 backdrop-blur-sm">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={waiting}
              className="flex-1 bg-white/10 text-white placeholder-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              onClick={handleSend}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition font-medium shadow shadow-white/10"
            >
              {waiting ? '...' : 'Send'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Floating Button */}
      <motion.button
        animate={{
            y: scrollIsMax ? -75 : 0, // shift up when at bottom
            opacity: 1
        }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen((prev) => !prev)}
        className="bg-black/40 border border-white/30 text-white rounded-full p-3 shadow-lg shadow-white/20 hover:bg-white/10 backdrop-blur-md transition"
      >
        <img src="./robot.png" alt="robot" className='w-7 h-7 md:w-10 md:h-10' />      
    </motion.button>

    </motion.div>
  );
};

export default Chatbot;
