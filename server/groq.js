import axios from "axios";
const API_KEY = "YOUR_API_KEY";

export default async function generateQuiz(inputText) {
  const prompt = `
You are a strict JSON generator.

ONLY return a **raw JSON array** of exactly 10 MCQs in this format:

[
  {
    "question": "...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "answer": "A|B|C|D"
  },
  ...
]

DO NOT include explanations, greetings, or any other text.

Input text:
"""${inputText}"""
`;

  const { data } = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
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

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    console.error("❌ No content returned from Groq");
    throw new Error("Empty response from Groq");
  }

  // ✅ Extract JSON array from response using regex
  const match = content.match(/\[\s*{[\s\S]*?}\s*\]/);
  if (!match) {
    console.error("❌ Could not extract JSON:\n", content);
    throw new Error("Groq returned non-JSON content");
  }

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("❌ Failed to parse extracted JSON:\n", match[0]);
    throw new Error("Groq returned invalid JSON");
  }
}
