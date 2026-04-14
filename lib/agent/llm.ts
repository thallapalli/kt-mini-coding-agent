export async function askLLM(prompt: string, apiKey: string) {
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    }
  );

  const text = await res.text(); // IMPORTANT (not json first)

  console.log("🔥 GROQ RAW RESPONSE:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Groq returned invalid JSON: " + text);
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "Groq returned empty content. Full response: " +
        JSON.stringify(data)
    );
  }

  return content;
}
