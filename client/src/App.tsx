import { useState } from "react";
import { extractTextFromPDF } from "./pdfUtils";
import { generateQuiz } from "./api";

export default function App() {
  const [inputText, setInputText] = useState<string>("");
  const [quiz, setQuiz] = useState<
    { question: string; options: Record<string, string>; answer: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  /* ------------ Handlers ------------ */
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }
    const text = await extractTextFromPDF(file);
    setInputText(text);
    console.log("PDF text:", text.slice(0, 120), "...");
  }

  async function handleGenerate() {
    if (!inputText.trim()) {
      alert("Paste text or upload a PDF first.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateQuiz(inputText.slice(0, 4000));
      console.log("Quiz JSON:", data);
      setQuiz(data);
    } catch (err) {
      console.error(err);
      alert("Quiz generation failed – see console.");
    } finally {
      setLoading(false);
    }
  }

  /* ------------ UI ------------ */
  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>Quiz Generator</h1>

      <textarea
        rows={8}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your text here…"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input type="file" accept="application/pdf" onChange={handleFile} />
      <br />
      <br />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating…" : "Generate Quiz"}
      </button>

      {quiz.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>Generated Quiz</h2>
          {quiz.map((q, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <strong>
                Q{i + 1}. {q.question}
              </strong>
              <ul>
                {Object.entries(q.options).map(([k, v]) => (
                  <li key={k}>
                    <b>{k}:</b> {v}
                  </li>
                ))}
              </ul>
              <em>Answer: {q.answer}</em>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
