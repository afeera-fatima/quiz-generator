// server/groq.js
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.GROQ_API_KEY;

async function generateQuiz(inputText) {
  const prompt = `
Generate exactly 10 multiple‑choice questions from the text below.
Return ONLY valid JSON: an array of objects, each object = {
  "question": "...",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "answer": "A|B|C|D"
}

Text:
"""${inputText}"""
`;

  const { data } = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "mixtral-8x7b-32768", // or "llama3-70b-8192"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return JSON.parse(data.choices[0].message.content);
}

module.exports = { generateQuiz };
