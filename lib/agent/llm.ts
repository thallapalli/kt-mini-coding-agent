import axios from "axios";

export async function askLLM(prompt: string, apiKey: string) {
  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return res.data.choices[0].message.content;
}
