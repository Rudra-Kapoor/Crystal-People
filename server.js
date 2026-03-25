import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SHEETS_URL   = process.env.SHEETS_URL || process.env.VITE_SHEETS_API_URL;

// ── AI proxy ─────────────────────────────────────────────────────
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

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: max_tokens || 1000,
        messages: groqMessages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Groq error" });
    }

    const text = data.choices?.[0]?.message?.content || "";
    res.json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Groq proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Sheets GET proxy ──────────────────────────────────────────────
app.get("/api/sheets", async (req, res) => {
  if (!SHEETS_URL) {
    return res.status(500).json({ error: "SHEETS_URL not set" });
  }
  try {
    const { default: fetch } = await import("node-fetch");
    const params = new URLSearchParams(req.query).toString();
    const url = `${SHEETS_URL}?${params}`;
    const response = await fetch(url, { redirect: "follow" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Sheets GET error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Sheets POST proxy ─────────────────────────────────────────────
app.post("/api/sheets", async (req, res) => {
  if (!SHEETS_URL) {
    return res.status(500).json({ error: "SHEETS_URL not set" });
  }
  try {
    const { default: fetch } = await import("node-fetch");
    const response = await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      redirect: "follow",
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Sheets POST error response:", data);
      return res.status(response.status).json({ success: false, error: data.error || "Sheets error" });
    }
    res.json(data);
  } catch (err) {
    console.error("Sheets POST exception:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Crystal People API running on http://localhost:${PORT}`);
  console.log(`   Groq:   ${GROQ_API_KEY ? "✅ Key found" : "❌ Missing GROQ_API_KEY"}`);
  console.log(`   Sheets: ${SHEETS_URL   ? "✅ URL found" : "❌ Missing SHEETS_URL"}`);
});