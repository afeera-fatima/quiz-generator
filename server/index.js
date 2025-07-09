import express from "express";
import cors from "cors";
import generateQuiz from "./groq.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post("/api/generate-quiz", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const quiz = await generateQuiz(text.slice(0, 4000)); // respect model context limit
    res.json({ quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
