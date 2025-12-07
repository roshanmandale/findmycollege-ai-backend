// server.js - Groq version

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------ CONFIG -------------
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Simple check
app.get("/", (req, res) => {
  res.send("Career AI Backend (Groq) Running 🚀");
});

// ------------ MAIN ENDPOINT -------------
app.post("/career-ai", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "Missing 'message' string in body" });
    }

    // Build request body for Groq
    const body = {
      model: "llama-3.1-8b-instant",   // or any model you see in Groq dashboard
      messages: [
        {
          role: "system",
          content:
            "You are a helpful Indian career counsellor. Give clear, practical " +
            "guidance about careers, streams, exams and best colleges, especially " +
            "for Maharashtra / India context."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 400
    };

    // Call Groq API using fetch (Node 18+ has global fetch)
    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorText);
      return res
        .status(500)
        .json({ error: "Groq API error", details: errorText });
    }

    const data = await groqResponse.json();

    const botReply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not generate a proper answer. Please try again.";

    // Send reply to Android app
    res.json({ reply: botReply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "AI server error" });
  }
});

// ------------ START SERVER -------------
app.listen(PORT, () => {
  console.log(`Career AI Backend (Groq) running on port ${PORT}`);
});
