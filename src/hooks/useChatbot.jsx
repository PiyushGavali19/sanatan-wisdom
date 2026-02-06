import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "mysarthi_chats";

const useChatbot = () => {
  const [chats, setChats] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isTyping, setTyping] = useState(false);

  // Load from localStorage
const [loaded, setLoaded] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    const parsed = JSON.parse(saved);
    setChats(parsed);
    setCurrentChatId(Object.keys(parsed)[0]);
  } else {
    createNewChat();
  }

  setLoaded(true);
}, []);



  // Auto save
 useEffect(() => {
  if (loaded) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }
}, [chats, loaded]);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ✅ Create new chat
  const createNewChat = () => {
    const id = uuidv4();

    const newChat = {
      id,
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => ({ ...prev, [id]: newChat }));
    setCurrentChatId(id);
  };

  // ✅ Rename chat
  const renameChat = (id, title) => {
    setChats((prev) => ({
      ...prev,
      [id]: { ...prev[id], title },
    }));
  };

  // ✅ Delete a chat completely
  const deleteChat = (id) => {
    const copy = { ...chats };
    delete copy[id];

    setChats(copy);

    if (Object.keys(copy).length > 0) {
      setCurrentChatId(Object.keys(copy)[0]);
    } else {
      createNewChat();
    }
  };

  // ✅ Clear only messages of current chat
  const clearMessages = () => {
    if (!currentChatId) return;

    setChats((prev) => ({
      ...prev,
      [currentChatId]: {
        ...prev[currentChatId],
        messages: [],
      },
    }));
  };

  // ✅ CLEAR ALL CHATS (True Clear Chat)
  const clearAllChats = () => {
    localStorage.removeItem(STORAGE_KEY);
    setChats({});
    setCurrentChatId(null);

    // create fresh chat after clearing
    setTimeout(createNewChat, 100);
  };

  // clear chat UI
  const clearChatUI = () => {
  const id = uuidv4();

  const newChat = {
    id,
    title: "New Chat",
    messages: [],
  };

  setChats((prev) => ({
    ...prev,
    [id]: newChat,
  }));

  setCurrentChatId(id);
};


  // ✅ Send message
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text,
      time: getTime(),
    };

    const updatedMsgs = [
      ...(chats[currentChatId]?.messages || []),
      userMsg,
    ];

    setChats((prev) => ({
      ...prev,
      [currentChatId]: {
        ...prev[currentChatId],
        messages: updatedMsgs,
        title:
          prev[currentChatId]?.messages?.length === 0
            ? text.slice(0, 20)
            : prev[currentChatId].title,
      },
    }));

    setTyping(true);

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a spiritual Sanatan AI. Answer with wisdom from Bhagavad Gita, Ramayana, Mahabharata and Hindu teachings in a simple respectful way.",
            },
            ...updatedMsgs.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
          },
        }
      );

      const botMsg = {
        sender: "bot",
        text: res.data.choices[0].message.content,
        time: getTime(),
      };

      setChats((prev) => ({
        ...prev,
        [currentChatId]: {
          ...prev[currentChatId],
          messages: [...updatedMsgs, botMsg],
        },
      }));
    } catch (err) {
      console.error(err);
    }

    setTyping(false);
  };

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    messages: chats[currentChatId]?.messages || [],
    isTyping,
    sendMessage,
    createNewChat,
    renameChat,
    deleteChat,
    clearChatUI,    // clears messages and creates fresh chat
    clearMessages,   // clears only messages
    clearAllChats,   // clears EVERYTHING
  };
};

export default useChatbot;
