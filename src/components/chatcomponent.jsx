import React from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { FiTrash2, FiPlus, FiMenu } from "react-icons/fi";
import useChatbot from "../hooks/useChatbot";
import useChatScroll from "../hooks/useChatScroll";
import Markdown from "react-markdown";

function ChatComponent() {
  const [input, setInput] = React.useState("");
  const [showSidebar, setShowSidebar] = React.useState(false);

  const {
    chats,
    currentChatId,
    setCurrentChatId,
    messages,
    sendMessage,
    isTyping,
    clearChatUI,
    createNewChat,
    deleteChat,
    renameChat,
  } = useChatbot();

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
    <div className="flex h-screen w-screen overflow-hidden">

      {/* OVERLAY (mobile) */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50 top-0 left-0 h-full w-64
          bg-orange-100 border-r flex flex-col
          transform transition-transform duration-300
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* New Chat */}
        <button
          onClick={createNewChat}
          className="flex items-center gap-2 m-3 p-3 bg-orange-400 text-white rounded-lg"
        >
          <FiPlus /> New Chat
        </button>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {Object.values(chats || {}).map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setCurrentChatId(chat.id);
                setShowSidebar(false);
              }}
              className={`p-3 mx-2 mb-2 rounded-lg cursor-pointer flex justify-between
              ${currentChatId === chat.id ? "bg-orange-300" : "bg-white"}`}
            >
              <span
                onDoubleClick={() => {
                  const name = prompt("Rename chat:");
                  if (name) renameChat(chat.id, name);
                }}
                className="truncate"
              >
                {chat.title || "New Chat"}
              </span>

              <FiTrash2
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="text-red-500"
              />
            </div>
          ))}
        </div>

        <div className="p-4 text-xs text-center border-t">
          🛕 Sanatan AI
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex flex-col flex-1 bg-orange-50">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-amber-300 to-orange-400 p-4 shadow-md flex justify-between items-center">

          <div className="flex items-center gap-3">
            {/* Menu Button (mobile only) */}
            <button
              className="md:hidden text-white"
              onClick={() => setShowSidebar(true)}
            >
              <FiMenu size={22} />
            </button>

            <div>
              <h1 className="text-lg md:text-xl font-bold text-white">
                🛕 Sanatan Wisdom
              </h1>
              <p className="text-xs md:text-sm text-white/90">
                Gita • Ramayana • Mahabharata
              </p>
            </div>
          </div>

          <button
            onClick={clearChatUI}
            className="text-white"
          >
            <FiTrash2 size={20} />
          </button>
        </div>

        {/* MESSAGES */}
        <div
          ref={ref}
          className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4"
        >
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="bg-white px-3 py-2 rounded-full shadow text-xs md:text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col max-w-[85%] md:max-w-xl ${
                msg.sender === "user"
                  ? "ml-auto items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl shadow text-sm ${
                  msg.sender === "user"
                    ? "bg-orange-400 text-white"
                    : "bg-white"
                }`}
              >
                <Markdown>{msg.text}</Markdown>
              </div>

              <span className="text-xs text-gray-500 mt-1">
                {msg.time}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="text-gray-500 italic text-sm">
              🛕 Sanatan AI is typing...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-2 p-3 md:p-4 bg-white border-t">
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
            className="p-3 bg-orange-400 text-white rounded-xl"
          >
            <LuSendHorizontal size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default ChatComponent;
