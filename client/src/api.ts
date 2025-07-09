import axios from "axios";

/** Calls backend `/api/generate-quiz` and returns parsed MCQ array */
export async function generateQuiz(text: string) {
  const { data } = await axios.post("http://localhost:5000/api/generate-quiz", {
    text,
  });
  return data.quiz;
}
