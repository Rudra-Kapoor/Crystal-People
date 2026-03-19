import { useState, useRef, useEffect } from "react";
import { Send, Lightbulb } from "lucide-react";
import { answerHRQuestion } from "../services/claudeService";
import { getCurrentMonthYear } from "../utils/helpers";

const { month: CURR_MONTH, year: CURR_YEAR } = getCurrentMonthYear();

const STARTER_QUESTIONS = [
  "Who hasn't been reviewed this month?",
  "Who is the top performer overall?",
  "Which department has the lowest average score?",
  "Who has improved the most in the last 3 months?",
  "Who has the lowest attendance score?",
  "Give me a summary of the team's overall health.",
];

export default function HRAssistant({ allReviews }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `👋 Hi! I'm **Claude**, your AI HR Assistant.\n\nI have access to all ${allReviews.length} performance reviews. Ask me anything about your team — scores, trends, who needs attention, or who's excelling.`,
    },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question) => {
    const q = (question || input).trim();
    if (!q || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    const res = await answerHRQuestion(q, allReviews, CURR_MONTH, CURR_YEAR);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: res.success
          ? res.text
          : `Sorry, I ran into an issue: ${res.error}. Make sure GROQ_API_KEY is set in your .env file.`,
        error: !res.success,
      },
    ]);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Chat */}
      <div className="lg:col-span-2 card p-0 flex flex-col" style={{ height: "580px" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
            <span className="text-lg">✨</span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Claude — HR Assistant</p>
            <p className="text-xs text-slate-500">
              AI-powered · {allReviews.length} reviews loaded
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-indigo-500 font-medium bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              Claude AI
            </span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-white font-bold">C</span>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : msg.error
                    ? "bg-rose-50 border border-rose-200 text-rose-700 rounded-tl-sm"
                    : "bg-slate-100 text-slate-800 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-white font-bold">C</span>
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  {[0, 150, 300].map((delay) => (
                    <div
                      key={delay}
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Claude anything about your team…"
              disabled={loading}
              className="input flex-1 text-sm"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="btn-primary px-4"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-amber-500" />
            <h3 className="font-semibold text-slate-700 text-sm">Suggested Questions</h3>
          </div>
          <div className="space-y-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="w-full text-left text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2.5 rounded-xl transition-all border border-slate-100 hover:border-indigo-200 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-panel text-sm">
          <p className="font-semibold text-indigo-700 mb-2 flex items-center gap-1.5">
            <span>✨</span> What Claude can do
          </p>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>• Find unreviewed employees</li>
            <li>• Rank top/bottom performers</li>
            <li>• Spot attendance issues</li>
            <li>• Analyse score trends</li>
            <li>• Department comparisons</li>
            <li>• Custom HR queries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
