import { Sparkles, RefreshCw, AlertTriangle } from "lucide-react";

export default function AIPanel({
  title,
  content,
  loading,
  error,
  onRefresh,
  variant = "default",
  children,
}) {
  const bgClass =
    variant === "warning"
      ? "bg-amber-50 border-amber-200"
      : variant === "success"
      ? "bg-emerald-50 border-emerald-200"
      : "bg-gradient-to-br from-violet-50 to-indigo-50 border-indigo-100";

  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${bgClass} animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-500" />
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-400 font-medium bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
            ✨ Claude AI
          </span>
          {onRefresh && !loading && (
            <button
              onClick={onRefresh}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
              title="Regenerate with Claude"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-3 py-2">
          <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin flex-shrink-0" />
          <span className="text-sm text-slate-500 italic">Claude is thinking…</span>
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 text-rose-600 text-sm">
          <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
          <span>
            {error.includes("GROQ_API_KEY") || error.includes("500")
              ? "Claude AI is not configured. Add GROQ_API_KEY to your .env file."
              : `Error: ${error}`}
          </span>
        </div>
      ) : content ? (
        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      ) : null}

      {children}
    </div>
  );
}