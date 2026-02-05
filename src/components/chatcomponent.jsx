import React from "react";
import { LuBot, LuSendHorizontal } from "react-icons/lu";
import useChatbot from "../hooks/useChatbot";
import useChatScroll from "../hooks/useChatScroll";
import Markdown from "react-markdown";

function ChatComponent() {
  const [input, setInput] = React.useState("");
  const { messages, sendMessage, isTyping } = useChatbot();
  const ref = useChatScroll(messages);

  const suggestions = [
    "📖 Give me a Bhagavad Gita quote",
    "🙏 Tell a Krishna story",
    "🧘 Give a meditation tip",
    "⚔️ Lesson from Mahabharata",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="flex flex-col h-[90vh] w-full max-w-3xl mx-4 mb-6 rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-b from-orange-100 via-yellow-50 to-amber-100">

        {/* 🛕 HEADER */}
      <div className="bg-gradient-to-r from-amber-300 to-orange-400 p-4 shadow-md text-center">
        <h1 className="text-2xl font-bold text-white">
          🛕 Sanatan Wisdom
        </h1>
        <p className="text-sm text-white/90">
          Gita • Ramayana • Mahabharata • Krishna Leela
        </p>
      </div>


        {/* Messages */}
        <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Suggestion Buttons */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="bg-white px-3 py-2 rounded-full shadow hover:bg-orange-200 text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col max-w-xs ${
                msg.sender === "user" ? "ml-auto items-end" : "items-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl shadow text-sm ${
                  msg.sender === "user"
                    ? "bg-orange-400 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <Markdown>{msg.text}</Markdown>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {msg.time}
              </span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="text-gray-500 italic text-sm">
              🛕 Sanatan AI is typing...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 p-4 bg-white/90 border-t">
          <input
            type="text"
            className="flex-1 p-3 border rounded-xl focus:outline-none"
            placeholder="Ask about Gita, Krishna..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleSend}
            className="p-3 bg-orange-400 text-white rounded-xl hover:bg-orange-500"
          >
            <LuSendHorizontal size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
