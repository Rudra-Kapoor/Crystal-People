// AI Service — Groq (LLaMA 3.3 70B) on the backend, shown as "Claude" in the UI
// This file intentionally keeps the name claudeService for UI consistency

const PROXY_URL = "/api/claude";

async function callClaude(prompt, systemPrompt = "", maxTokens = 600) {
  const body = {
    system: systemPrompt,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const text =
      data.content
        ?.filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("") || "";
    return { success: true, text };
  } catch (err) {
    console.error("Claude AI error:", err);
    return { success: false, error: err.message, text: "" };
  }
}

// ── 1. Check consistency between scores and comment ──────────────
export async function checkFeedbackConsistency(scores, comment) {
  const avg = (
    (scores.outputQuality + scores.attendance + scores.teamwork) /
    3
  ).toFixed(1);
  const prompt = `
A manager scored an employee:
- Output Quality: ${scores.outputQuality}/5
- Attendance: ${scores.attendance}/5
- Teamwork: ${scores.teamwork}/5
- Average score: ${avg}/5

Manager's written comment: "${comment}"

Analyse whether the scores and comment are consistent with each other.
Be concise — 2-3 sentences max.
If consistent, say so briefly.
If there's a mismatch (e.g. high scores but negative comment, or vice versa), flag it clearly and explain what's inconsistent.
Start with either ✅ Consistent or ⚠️ Mismatch detected.
`;
  return callClaude(
    prompt,
    "You are an HR review quality checker. Be direct and concise.",
    200
  );
}

// ── 2. Improve / rewrite manager comment ─────────────────────────
export async function improveFeedback(scores, rawComment, employeeName) {
  const avg = (
    (scores.outputQuality + scores.attendance + scores.teamwork) /
    3
  ).toFixed(1);
  const prompt = `
Improve this manager's performance review comment for employee ${employeeName}.

Scores:
- Output Quality: ${scores.outputQuality}/5
- Attendance: ${scores.attendance}/5
- Teamwork: ${scores.teamwork}/5
- Average: ${avg}/5

Original comment: "${rawComment}"

Write an improved version that is:
1. Specific and actionable (not vague)
2. Balanced (acknowledges strengths and areas to improve)
3. Professional and constructive
4. 2-4 sentences maximum
5. Consistent with the scores given

Return ONLY the improved comment text, no preamble.
`;
  return callClaude(
    prompt,
    "You are an expert HR manager who writes clear, specific, and fair performance reviews.",
    300
  );
}

// ── 3. Summarise performance trend (3-6 months) ──────────────────
export async function summarizePerformanceTrend(reviews, employeeName) {
  if (!reviews || reviews.length === 0) {
    return { success: true, text: "No review history available yet." };
  }

  const sorted = [...reviews].sort(
    (a, b) =>
      new Date(`${a.month} ${a.year}`) - new Date(`${b.month} ${b.year}`)
  );
  const recent = sorted.slice(-6);

  const reviewText = recent
    .map(
      (r) =>
        `${r.month} ${r.year}: Output Quality ${r.outputQuality}/5, Attendance ${r.attendance}/5, Teamwork ${r.teamwork}/5. Comment: "${r.comment}"`
    )
    .join("\n");

  const prompt = `
Here is the performance review history for ${employeeName} over the last ${recent.length} months:

${reviewText}

Write a plain-English performance trend summary that:
1. Identifies key trends (improving, declining, consistent)
2. Highlights their strongest and weakest dimensions
3. Notes any notable changes
4. Is warm, professional, and objective
5. Is 3-5 sentences maximum

Make it feel human and insightful, not robotic.
`;
  return callClaude(
    prompt,
    "You are an empathetic HR analytics expert.",
    400
  );
}

// ── 4. Suggest improvements for low scores ───────────────────────
export async function suggestImprovements(scores, comment, employeeName) {
  const lowAreas = [];
  if (scores.outputQuality <= 3)
    lowAreas.push(`Output Quality (${scores.outputQuality}/5)`);
  if (scores.attendance <= 3)
    lowAreas.push(`Attendance (${scores.attendance}/5)`);
  if (scores.teamwork <= 3) lowAreas.push(`Teamwork (${scores.teamwork}/5)`);

  if (lowAreas.length === 0) {
    return {
      success: true,
      text: "🌟 All dimensions are scoring well! Keep up the excellent work and consider mentoring newer team members.",
    };
  }

  const prompt = `
${employeeName} scored low in these areas: ${lowAreas.join(", ")}.
Manager comment: "${comment}"

Give 3 specific, actionable improvement suggestions (one per low area if multiple).
Format as a numbered list. Each suggestion should be concrete — e.g. specific habits, tools, or practices they can adopt.
Keep the tone encouraging and constructive. Max 4 sentences per suggestion.
`;
  return callClaude(
    prompt,
    "You are a supportive performance coach who gives practical, specific advice.",
    500
  );
}

// ── 5. HR Assistant — answer natural language HR questions ────────
export async function answerHRQuestion(
  question,
  allReviews,
  currentMonth,
  currentYear
) {
  if (!allReviews || allReviews.length === 0) {
    return {
      success: true,
      text: "No review data is available yet to answer HR questions.",
    };
  }

  const reviewsSummary = JSON.stringify(
    allReviews.map((r) => ({
      employee: r.employeeName,
      month: r.month,
      year: r.year,
      outputQuality: r.outputQuality,
      attendance: r.attendance,
      teamwork: r.teamwork,
      avg: +(
        (r.outputQuality + r.attendance + r.teamwork) /
        3
      ).toFixed(2),
    }))
  );

  const prompt = `
You are an HR assistant with access to all employee performance review data.

Current month: ${currentMonth} ${currentYear}

Review data (JSON):
${reviewsSummary}

HR Manager's question: "${question}"

Answer the question accurately based on the data.
- Be concise but complete
- Use plain English (no jargon)
- If listing employees, format as a short bullet list
- If the data doesn't have enough info to answer, say so honestly
- Round numbers to 1 decimal place
`;
  return callClaude(
    prompt,
    "You are a precise, helpful HR data analyst. Answer questions based only on the provided data.",
    700
  );
}