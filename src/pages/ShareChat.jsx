import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Markdown from "react-markdown";

function ShareChat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/share/${id}`)
      .then((res) => setMessages(res.data.messages));
  }, [id]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex justify-center items-center">
      
      {/* Chat Card */}
      <div className="w-full max-w-3xl h-[90vh] bg-white shadow-xl rounded-xl flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 rounded-t-xl">
          <h1 className="text-2xl font-bold text-center">
            🛕 Shared Chat
          </h1>
          <p className="text-center text-gray-500 text-sm">
            View-only shared conversation
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-orange-400 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          ))}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="p-3 border-t text-center text-xs text-gray-400">
          Shared via MySarthi ✨
        </div>
      </div>
    </div>
  );
}

export default ShareChat;
