import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useIsMobile } from '../hooks/useIsInMobile';
import axios from 'axios';
import DOMPurify from "dompurify";
import useScrollDetect from '../hooks/useScrollDetect';

const Chatbot = () => {
  const scrollIsMax = useScrollDetect();
  const isMobile = useIsMobile();
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
      initial={{ opacity: 0 }}
      animate={{
        y: scrollIsMax ? -95 : 0,
        opacity: 1,
      }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="
        fixed 
        right-3 bottom-4
        sm:right-5 sm:bottom-3
        md:right-8 md:bottom-8
        lg:right-5 lg:bottom-5
        z-100 flex flex-col items-end gap-3
      "
    >
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="
            w-[260px] h-[460px]
            sm:w-[320px] sm:h-[520px]
            md:w-[340px] md:h-[550px]
            lg:w-[380px] lg:h-[620px]
            xl:w-[420px] xl:h-[650px]

            bg-black/40 backdrop-blur-md 
            rounded-2xl shadow-lg shadow-white/20
            border border-white/20 overflow-hidden flex flex-col
          "
        >

          {/* HEADER */}
          <div className="bg-black/50 text-white px-4 py-3 flex justify-between items-center border-b border-white/20">
            <span className="font-semibold text-lg tracking-tight">💈 BarberBot</span>
            <button onClick={() => setOpen(false)} className="hover:text-gray-300 transition">
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' ? (
                  <>
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
                    <div
                      className="
                        p-2 sm:p-3 rounded-xl 
                        max-w-[75%] text-xs sm:text-sm 
                        bg-white/10 backdrop-blur-sm text-white 
                        shadow shadow-white/10
                      "
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(msg.text.replace(/```html|```/g, "").trim())
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className="
                        p-2 sm:p-3 rounded-xl 
                        max-w-[75%] text-xs sm:text-sm
                        bg-white text-black shadow shadow-white/20
                      "
                    >
                      {msg.text}
                    </div>
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="flex gap-2 p-2 sm:p-3 border-t border-white/20 bg-black/50 backdrop-blur-sm">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={waiting}
              className="
                flex-1 bg-white/10 text-white 
                placeholder-gray-300 rounded-lg 
                px-2 py-2 sm:px-3 sm:py-2 
                text-xs sm:text-sm 
                focus:outline-none focus:ring-2 focus:ring-white/40
              "
            />
            <button
              onClick={handleSend}
              className="
                bg-white/20 text-white 
                px-3 sm:px-4 py-2 rounded-lg 
                text-xs sm:text-sm 
                hover:bg-white/30 transition 
                shadow shadow-white/10
              "
            >
              {waiting ? '...' : 'Send'}
            </button>
          </div>
        </motion.div>
      )}

      {/* FLOATING BUTTON */}
      <motion.button
        animate={{
          y: scrollIsMax ? 20 : 0,
          opacity: 1
        }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen(prev => !prev)}
        className="
          bg-black/40 border border-white/30 text-white rounded-full 
          p-2 sm:p-3 md:p-4 
          shadow-lg shadow-white/20 hover:bg-white/10 
          backdrop-blur-md transition
        "
      >
        <img
          src="./robot.png"
          alt="robot"
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-11 md:h-11"
        />
      </motion.button>
    </motion.div>
  );
};

export default Chatbot;
