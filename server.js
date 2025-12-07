// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// load .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ create OpenAI client (key from environment)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ simple test route (for browser)
app.get("/", (req, res) => {
  res.send("Career AI Backend Running 🚀");
});

// ✅ main API route used by Android app
app.post("/career-ai", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Indian career counsellor. " +
            "Help students decide courses, branches, and suitable colleges based on their marks and interests. " +
            "Explain in very simple English.",
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 350,
    });

    const botReply = response.choices[0]?.message?.content ?? "Sorry, I have no answer.";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Career AI error:", error);

    // small error message to app
    res.status(500).json({
      error: "AI server error. Please try again later.",
    });
  }
});

// ✅ start server (Render will use process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Career AI backend running on port ${PORT}`);
});
