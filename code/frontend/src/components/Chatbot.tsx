'use client';

import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I am your SmartCare assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[500px]">
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" /> SmartCare AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] p-3 rounded-lg ${
                   msg.role === 'user' 
                     ? 'bg-blue-600 text-white rounded-br-none' 
                     : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                 }`}>
                   {msg.content}
                 </div>
               </div>
             ))}
             {loading && (
               <div className="flex justify-start">
                 <div className="bg-white text-gray-500 p-3 rounded-lg border border-gray-200 rounded-bl-none shadow-sm text-sm">
                   Typing...
                 </div>
               </div>
             )}
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
