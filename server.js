import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Works on both /api/claude (old) and /api/ai (new) — so nothing breaks
app.post(["/api/claude", "/api/ai"], async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY not set in .env" });
  }
  try {
    const { default: fetch } = await import("node-fetch");
    const { system, messages, max_tokens } = req.body;

    const groqMessages = [];
    if (system) groqMessages.push({ role: "system", content: system });
    if (messages) groqMessages.push(...messages);

    const groqBody = {
      model: "llama-3.3-70b-versatile",
      max_tokens: max_tokens || 1000,
      messages: groqMessages,
    };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(groqBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Groq API error" });
    }

    // Return in Claude-style format so frontend needs zero changes
    const text = data.choices?.[0]?.message?.content || "";
    res.json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Groq proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Crystal People API proxy running on http://localhost:${PORT}`);
  console.log(
    `   AI Engine: ${GROQ_API_KEY ? "✅ Groq key found" : "❌ Missing GROQ_API_KEY in .env"}`
  );
});