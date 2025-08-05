import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, MessageCircle, X } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [waiting, setWaiting] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (!input.trim() || waiting) return;

        const userMessage = { sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setWaiting(true);

        try{
            const response = await axios.post('/api/chatbot', {prompt: input.trim()});
            setInput('');
    

            if(response.status === 200 && response.data.message){

                setTimeout(() => {
                    const botReply = { sender: 'bot', text: response.data.message};
                    setMessages(prev => [...prev, botReply]);
                }, 500);

                setInput('');
                setWaiting(false);
            }


        }catch(err){
            console.log(err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="fixed bottom-5 right-2 z-50 flex flex-col items-end gap-2">
        {/* Chat window */}
        {open && (
            <div className="w-[300px] h-[500px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gray-600 text-white p-3 font-bold text-lg flex items-center justify-between">
                    <span className='tracking-tighter font-light'>BarberBot</span>
                    <button onClick={() => setOpen(false)}>
                    <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                    {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        {msg.sender === 'bot' && <Bot className="w-5 h-5 text-gray-600" />}
                        <div
                        className={`p-2 rounded-lg max-w-[75%] text-sm ${
                            msg.sender === 'user'
                            ? 'bg-gray-600 text-right text-white'
                            : 'bg-gray-200 text-left'
                        }`}
                        >
                            {msg.text}
                        </div>
                        {msg.sender === 'user' && <User className="w-5 h-5 text-gray-600" />}
                    </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2 p-3 border-t">
                    <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 bg-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <button
                    onClick={handleSend}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                    >
                    {waiting ? '...' : 'Send'}
                    </button>
                </div>
            </div>
        )}

            {/* Floating Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="bg-gray-600 text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition"
            >
                <img src="./robot.png" alt="robot" />
            </button>
        </div>
    );
};

export default Chatbot;