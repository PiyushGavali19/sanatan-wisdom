import { useState, useEffect } from "react";
import axios from "axios";

const CHAT_KEY = "chat_history";
const MEMORY_KEY = "ai_memory";

const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Load chat history
  useEffect(() => {
    const saved = localStorage.getItem(CHAT_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // ✅ Save chat history
  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }, [messages]);

  // ⏰ Timestamp
  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // 🧠 Memory extraction
  const askAIToRemember = async (userText) => {
    try {
      const lower = userText.toLowerCase();

      // Force name saving
      if (lower.includes("my name is")) {
        let saved =
          JSON.parse(localStorage.getItem(MEMORY_KEY)) || [];
        saved.push(userText);

        localStorage.setItem(
          MEMORY_KEY,
          JSON.stringify(saved.slice(-20))
        );
        return;
      }

      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Extract permanent user facts (name, preferences, goals). If none reply ONLY 'NONE'.",
            },
            { role: "user", content: userText },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
          },
        }
      );

      const memory = res.data.choices[0].message.content;

      if (memory && memory !== "NONE") {
        let saved =
          JSON.parse(localStorage.getItem(MEMORY_KEY)) || [];

        saved.push(memory);

        localStorage.setItem(
          MEMORY_KEY,
          JSON.stringify(saved.slice(-20))
        );
      }
    } catch (err) {
      console.log("Memory error", err);
    }
  };

  // 🚀 Send message
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    askAIToRemember(message);

    const userMsg = {
      text: message,
      sender: "user",
      time: getTime(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);

    try {
      setIsTyping(true); // ✅ typing start

      const memories =
        JSON.parse(localStorage.getItem(MEMORY_KEY)) || [];

      const memoryPrompt =
        memories.length > 0
          ? {
              role: "system",
              content:
                "User facts:\n" + memories.join("\n"),
            }
          : null;

      const spiritualPrompt = {
        role: "system",
        content:
          "You are Sanatan AI, a wise spiritual guide. Answer using Bhagavad Gita, Ramayana, Mahabharata and Sanatan Dharma teachings. Be calm, kind and devotional.",
      };

      const history = updated.map((m) => ({
        role:
          m.sender === "user"
            ? "user"
            : "assistant",
        content: m.text,
      }));

      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o-mini",
          messages: [
            spiritualPrompt,
            memoryPrompt,
            ...history.slice(-12),
          ].filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
          },
        }
      );

      const botMsg = {
        text: res.data.choices[0].message.content,
        sender: "bot",
        time: getTime(),
      };

      setMessages([...updated, botMsg]);
      setIsTyping(false); // ✅ typing end

    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  // 🧹 Clear chat
  const clearAll = () => {
    localStorage.clear();
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    clearAll,
    isTyping,
  };
};

export default useChatbot;
