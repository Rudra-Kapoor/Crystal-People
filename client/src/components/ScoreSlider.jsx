import { scoreToColor, scoreLabel } from "../utils/helpers";

const SCORE_COLORS = ["", "bg-rose-400", "bg-orange-400", "bg-amber-400", "bg-sky-400", "bg-emerald-400"];

export default function ScoreSlider({ label, icon, value, onChange, readOnly = false }) {
  const colorClass = SCORE_COLORS[value] || "bg-slate-300";
  const textColorClass = scoreToColor(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span>{icon}</span>
          {label}
        </label>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${textColorClass}`}>
          {value}/5 · {scoreLabel(value)}
        </div>
      </div>

      {/* Pip indicators */}
      <div className="flex gap-1.5 mb-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-2 flex-1 rounded-full transition-all duration-200 ${
              n <= value ? colorClass : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {readOnly ? (
        <p className="text-xs text-slate-400 italic">Score locked</p>
      ) : (
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-indigo-600"
          style={{
            background: `linear-gradient(to right, #4f46e5 ${((value - 1) / 4) * 100}%, #e2e8f0 ${((value - 1) / 4) * 100}%)`,
          }}
        />
      )}

      {/* Labels */}
      {!readOnly && (
        <div className="flex justify-between text-xs text-slate-400 px-0.5">
          <span>1 Poor</span>
          <span>3 OK</span>
          <span>5 Excellent</span>
        </div>
      )}
    </div>
  );
}
