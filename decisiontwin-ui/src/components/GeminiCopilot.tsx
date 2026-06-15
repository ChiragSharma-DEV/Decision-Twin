import { useState, useRef, useEffect } from "react";
import { Brain, Send, ChevronDown } from "lucide-react";

interface GeminiCopilotProps {
  onNavigateToTab?: (tab: string) => void;
}

export default function GeminiCopilot({ onNavigateToTab }: GeminiCopilotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "gemini"; text: string }>>([
    {
      sender: "gemini",
      text: "👋 **Welcome Officer.** I am your Gemini Governance assistant. Ask me questions about AI bias, policy risks, NITI Aayog guidelines, or RBI lending frameworks."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [geminiLive, setGeminiLive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const QUICK_QUESTIONS = [
    { label: "Why is rural disparity increasing?", q: "Why is rural disparity increasing?" },
    { label: "Which policy reduces bias most?", q: "Which policy reduces bias most?" },
    { label: "Show RBI compliance gaps", q: "Show RBI compliance gaps" },
    { label: "Generate audit report", q: "Generate audit report", isNav: "audit" },
    { label: "Predict 2035 outcomes", q: "Predict 2035 outcomes" }
  ];

  useEffect(() => {
    fetch("/api/gemini-status")
      .then((res) => res.json())
      .then((data) => setGeminiLive(Boolean(data.live)))
      .catch(() => setGeminiLive(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const matchedQuick = QUICK_QUESTIONS.find(x => x.q === textToSend);
    if (matchedQuick?.isNav && onNavigateToTab) {
      onNavigateToTab(matchedQuick.isNav);
      return;
    }

    const priorHistory = chatHistory;
    setChatHistory(prev => [...prev, { sender: "user", text: textToSend }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          previousMessages: priorHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API call failed");
      }

      setGeminiLive(Boolean(data.live));
      setChatHistory(prev => [...prev, { sender: "gemini", text: data.reply }]);
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Unable to reach Gemini";
      setChatHistory(prev => [
        ...prev,
        {
          sender: "gemini",
          text: geminiLive
            ? `⚠️ **Gemini Error**: ${detail}`
            : "⚠️ **Offline mode**: Add `GEMINI_API_KEY` to `.env.local` and restart `npm run dev` for live Gemini responses.",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h4 key={idx} className="text-sm font-serif font-bold p-text-main mt-3 mb-1">{trimmed.replace("###", "")}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return <h3 key={idx} className="text-base font-serif font-bold p-text-main mt-4 mb-2 border-b p-border pb-1">{trimmed.replace("##", "")}</h3>;
      }
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        return (
          <li key={idx} className="text-[11px] p-text-muted ml-4 list-disc mt-1">
            {trimmed.substring(1).trim().replace(/\*\*(.*?)\*\*/g, "$1")}
          </li>
        );
      }
      if (trimmed.startsWith("|")) {
        return (
          <div key={idx} className="text-[10px] font-mono p-bg-secondary p-1 px-2 border p-border p-text-muted my-0.5 whitespace-pre-wrap rounded">
            {trimmed}
          </div>
        );
      }
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(trimmed)) {
        const parts = trimmed.split(boldRegex);
        return (
          <p key={idx} className="text-[11px] p-text-muted leading-relaxed mt-1.5 font-sans">
            {parts.map((p, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="p-text-accent font-bold">{p}</strong> : p))}
          </p>
        );
      }
      return <p key={idx} className="text-[11px] p-text-muted leading-relaxed mt-1 font-sans">{line}</p>;
    });
  };

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isOpen ? "w-96 h-[500px]" : "w-14 h-14"}`} id="gemini-copilot-container">
      {isOpen ? (
        <div className="w-full h-full rounded border p-border p-bg-card shadow-xl flex flex-col overflow-hidden relative">
          {/* Header */}
          <div className="p-3.5 border-b p-border flex items-center justify-between p-bg-secondary">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border p-border p-bg-card flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 p-text-accent" />
              </div>
              <div>
                <span className="text-xs font-bold p-text-main">Gemini Governance</span>
                <span className={`text-[8px] font-mono block mt-0.5 font-bold ${geminiLive ? "p-text-success" : "p-text-warning"}`}>
                  {geminiLive ? "GEMINI LIVE" : "OFFLINE FALLBACK"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:p-bg-secondary p-text-muted cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Container */}
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded p-3 text-xs leading-relaxed ${
                    item.sender === "user"
                      ? "p-bg-accent text-white items-end"
                      : "p-bg-secondary border p-border p-text-main"
                  }`}
                >
                  <p className="font-bold text-[8px] font-mono p-text-muted uppercase tracking-wider mb-1">
                    {item.sender === "user" ? "Admin Gov" : "Gemini Analyst"}
                  </p>
                  <div>{formatMarkdown(item.text)}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-bg-secondary border p-border rounded p-3 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="text-[10px] font-mono p-text-muted">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick recommendations */}
          <div className="px-3 py-2 border-t p-border overflow-x-auto whitespace-nowrap flex gap-1.5 p-bg-secondary">
            {QUICK_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.q)}
                className="inline-block px-2.5 py-1 text-[9px] p-bg-card border p-border hover:p-border-active p-text-main rounded-full cursor-pointer transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <div className="p-3 border-t p-border flex items-center gap-2 p-bg-secondary">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(message)}
              placeholder="Query Gemini compliance nodes..."
              className="flex-grow p-bg-card border p-border rounded px-3 py-2 text-xs p-text-main placeholder-neutral-500 focus:outline-none focus:p-border-active font-sans"
            />
            <button
              onClick={() => handleSend(message)}
              className="p-2 rounded p-bg-accent text-white hover:p-bg-accent-hover transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full p-bg-accent hover:scale-105 transition-all text-white flex items-center justify-center shadow-lg group relative cursor-pointer"
          title="Open Gemini AI Governance Copilot"
        >
          <Brain className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
          </span>
        </button>
      )}
    </div>
  );
}
