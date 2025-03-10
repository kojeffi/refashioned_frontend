 "use client"

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SectionBestDeals from './SectionBestDeals';
import SectionBrands from './SectionBrands';
import SectionHeader from './SectionHeader';
import SectionProducts from './SectionProducts';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch('https://refashioned.onrender.com/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      if (data?.data?.bot_response) {
        setMessages([...messages, userMessage, { sender: 'bot', text: data.data.bot_response }]);
      }
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    }
  };

  return (
    <div>
      <button
        className="fixed bottom-5 right-5 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={28} />
      </button>
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 bg-white shadow-lg rounded-lg p-4 border border-gray-300">
          <div className="h-64 overflow-y-auto mb-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              className="flex-1 p-2 border rounded-l-lg focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="bg-blue-600 text-white p-2 rounded-r-lg" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <div>
      <div className="my-7">
        <SectionHeader />
      </div>

      <div className="mb-32">
        <SectionBestDeals />
      </div>

      <div className="mb-32">
        <SectionProducts />
      </div>

      {/* <div className="mb-32">
        <SectionBrands />
      </div> */}

      <Chatbot />
    </div>
  );
};

export default Page;
