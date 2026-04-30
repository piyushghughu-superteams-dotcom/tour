import { useState, useRef, useEffect } from "react";
import type { Profile } from "../components/ProfileSetupModal";

const PROFILE_STORAGE_KEY = "mp-tourism-profile";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content: "Namaste! I'm your AI Travel Companion for Madhya Pradesh. I can help you plan your itinerary, find the best local food, or explain the history of our heritage sites. How can I assist you today?",
    timestamp: new Date(),
  },
];

const SUGGESTIONS = [
  "What are the best tiger reserves in MP?",
  "Plan a 3-day spiritual trip to Ujjain.",
  "Tell me about the history of Khajuraho.",
  "What's the best time to visit Pachmarhi?",
];

export default function AIChat({ profile: propProfile }: { profile?: Profile | null }) {
  const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  const savedProfile: Profile | null = propProfile ?? (stored ? (() => { try { return JSON.parse(stored); } catch { return null; } })() : null);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: getMockResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setIsTyping(false);
  };

  const getMockResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q === "hi" || q === "hello" || q === "hey") {
      return `Namaste ${savedProfile?.name || ""}! How can I help you explore the heart of Incredible India today?`;
    }
    if (q.includes("platform") || q.includes("about this") || q.includes("what is this")) {
      return "This is the MP Tourism AI Dashboard—a premium digital companion designed to make your travel across Madhya Pradesh effortless. We use advanced AI to help you plan trips, optimize routes, manage budgets, and explore the rich heritage of our state. Every feature is crafted to provide a high-end, personalized experience.";
    }
    if (q.includes("tiger") || q.includes("wildlife")) {

      return "Madhya Pradesh is the 'Tiger State of India'. Kanha, Bandhavgarh, and Pench are our crown jewels. Bandhavgarh has the highest density of Royal Bengal Tigers, while Kanha is famous for saving the Barasingha (Hard-ground Swamp Deer) from extinction.";
    }
    if (q.includes("ujjain") || q.includes("spiritual")) {
      return "Ujjain is one of the holiest cities, home to the Mahakaleshwar Jyotirlinga. I recommend witnessing the Bhasma Aarti and visiting the newly inaugurated Mahakal Lok corridor. You should also visit Omkareshwar, another Jyotirlinga, which is about 140km from Ujjain.";
    }
    if (q.includes("food")) {
      return "You must try Poha-Jalebi for breakfast in Indore, Bhutte ka Kees, and the famous 'Dal Bafla'. For sweets, don't miss the Gajak from Morena and Mawa Bati.";
    }
    return "That's a great question about MP! Our state is filled with hidden gems from the marble rocks of Bhedaghat to the ancient stupas of Sanchi. Would you like me to help you create a specific itinerary for these locations?";
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-9rem)] min-h-[600px] overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-xl">
      
      {/* Left Sidebar: Recent Chats / Info */}
      <div className="hidden xl:flex w-[320px] flex-shrink-0 border-r border-slate-200 bg-white/80 flex-col h-full">
        <div className="p-7 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Conversations</p>
            <h2 className="mt-2 font-display text-2xl text-slate-900">AI Chat</h2>
          </div>
          <button 
            onClick={handleNewChat}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition shadow-md group"
            title="Start New Chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform duration-300">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">

          <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-left transition shadow-sm">
            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-emerald-500 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Current Exploration</p>
              <p className="text-xs text-slate-500 truncate">Exploring MP Tourism...</p>
            </div>
          </button>
          
          <div className="mt-8 px-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Suggestions</p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition text-xs font-semibold text-slate-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
              {savedProfile?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{savedProfile?.name || "Traveler"}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Active Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white/40 relative">
        {/* Chat Header */}
        <div className="xl:hidden flex items-center justify-between p-5 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">AI Companion</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <button 
            onClick={handleNewChat}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition shadow-md"
            title="Start New Chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8"
        >
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${
                  msg.role === "user" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-emerald-600"
                }`}>
                  {msg.role === "user" ? (
                    <span className="text-xs font-bold">{savedProfile?.name?.charAt(0) || "U"}</span>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
                    </svg>
                  )}
                </div>
                <div className={`space-y-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`p-4 md:p-5 rounded-[1.5rem] text-sm leading-7 shadow-sm ${
                    msg.role === "user" 
                      ? "bg-slate-900 text-white rounded-tr-none" 
                      : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium px-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex gap-4 max-w-[70%]">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
                  </svg>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 bg-white/60 backdrop-blur-md border-t border-slate-200">
          <div className="max-w-4xl mx-auto relative">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="relative"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Madhya Pradesh..."
                className="w-full bg-white border border-slate-200 rounded-[2rem] pl-6 pr-20 py-5 text-sm shadow-[0_8px_30px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2.5 top-2.5 bottom-2.5 px-6 rounded-[1.5rem] bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 disabled:bg-slate-300 transition-all shadow-md flex items-center justify-center gap-2"
              >
                Send
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
            <p className="mt-4 text-center text-[10px] text-slate-400 font-medium">
              AI companion can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
