// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());               // allow all origins (Android, web, etc.)
app.use(express.json());

// 🔹 Initialize OpenAI client (uses key from environment variable)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Career AI Backend Running 🚀");
});

// 🔹 Main AI endpoint
app.post("/career-ai", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({ error: "message is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Indian career counselor. You help students choose streams, branches, exams and colleges. Explain in simple English.",
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 400,
    });

    const botReply = response.choices[0]?.message?.content ?? "No reply";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "AI server error" });
  }
});

// 🔹 Start server (Render will give PORT env var)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 AI backend running at http://localhost:${PORT}`);
});
