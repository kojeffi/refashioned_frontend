"use client";

import React, { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import SectionBestDeals from "./SectionBestDeals";
import SectionBrands from "./SectionBrands";
import SectionHeader from "./SectionHeader";
import SectionProducts from "./SectionProducts";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("https://refashioned.onrender.com/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      if (data?.data?.bot_response) {
        setMessages([...messages, userMessage, { sender: "bot", text: data.data.bot_response }]);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  return (
    <div>
      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chatbox UI */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-4 border border-gray-300 transition-all">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center pb-2 border-b border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700">Chat with us</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-red-500 transition">
              <X size={22} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto space-y-2 p-2 scrollbar-thin scrollbar-thumb-gray-400">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.sender === "user" 
                  ? "bg-blue-500 text-white self-end ml-auto" 
                  : "bg-gray-100 text-gray-700 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex mt-2">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-l-full focus:outline-none placeholder-gray-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button 
              className="bg-blue-600 text-white p-2 rounded-r-full hover:bg-blue-700 transition"
              onClick={sendMessage}
            >
              <Send size={18} />
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
