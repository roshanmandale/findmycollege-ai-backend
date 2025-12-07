// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ----- OpenAI client -----
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Career AI Backend Running 🚀");
});

// ----- Main endpoint used by Android app -----
app.post("/career-ai", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "Invalid or missing 'message' field" });
    }

    console.log("👉 Received message from app:", userMessage);

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Indian career counsellor. " +
            "Give clear, practical guidance about courses, exams and colleges, " +
            "especially for Maharashtra / India context."
        },
        { role: "user", content: userMessage }
      ],
      max_tokens: 300
    });

    const botReply = response.choices[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a proper answer. Please try again.";

    console.log("🤖 AI reply:", botReply);

    // This is what Android expects:  { "reply": "..." }
    res.json({ reply: botReply });

  } catch (error) {
    console.error("🔥 Server error in /career-ai:", error);

    // send some info back to app for debugging (no secrets)
    res.status(500).json({
      error: "AI server error",
      detail: error.message || "Unknown error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Career AI Backend running on port " + PORT);
});
