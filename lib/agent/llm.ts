export async function askLLM(
  prompt: string,
  apiKey: string,
  provider: string,
  model: string
) {
  switch (provider) {
    case "groq":
      return callGroq(prompt, apiKey, model);

    case "openai":
      return callOpenAI(prompt, apiKey, model);

    case "gemini":
      return callGemini(prompt, apiKey, model);

    case "claude":
      return callClaude(prompt, apiKey, model);

    default:
      throw new Error("Unsupported provider: " + provider);
  }
}

/* ---------------- GROQ ---------------- */
async function callGroq(prompt: string, apiKey: string, model: string) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

/* ---------------- OPENAI ---------------- */
async function callOpenAI(prompt: string, apiKey: string, model: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

/* ---------------- GEMINI ---------------- */
async function callGemini(prompt: string, apiKey: string, model: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/* ---------------- CLAUDE (basic placeholder) ---------------- */
async function callClaude(prompt: string, apiKey: string, model: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data?.content?.[0]?.text || "";
}
