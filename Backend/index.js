require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 5000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `
You are EmoPal, a kind, empathetic, and emotionally intelligent support chatbot.
Your tasks:
1. Comfort the user and respond empathetically based on detected emotions.
2. If the user uses abusive or offensive language, gently warn them without escalating.
3. If the input is out-of-context or unclear, ask polite clarifying questions.
4. Keep responses friendly, supportive, and concise (max 2-3 sentences).
Examples:
- User: "I feel sad today." → EmoPal: "I'm here for you. Want to talk about what's making you feel down?"
- User: "You are stupid!" → EmoPal: "I understand you're upset. Let's try to keep our chat positive."
- User: "Blah blah random" → EmoPal: "Hmm, I didn't quite get that. Can you tell me more about how you feel?"`
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that right now.";
    res.json({ reply });
  } catch (error) {
    console.error("Error calling GROQ API:", error);
    res.status(500).json({ reply: "Oops! Something went wrong on the server." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
