import { Provider } from "./types";

/**
 * MAIN ENTRY
 */
export async function askLLM(
  prompt: string,
  apiKey: string,
  provider: Provider,
  model: string
): Promise<string> {
  let result = "";

  switch (provider) {
    case "groq":
      result = await callGroq(prompt, apiKey, model);
      break;

    case "openai":
      result = await callOpenAI(prompt, apiKey, model);
      break;

    case "gemini":
      result = await callGemini(prompt, apiKey, model);
      break;

    case "claude":
      result = await callClaude(prompt, apiKey, model);
      break;

    default:
      throw new Error("Unsupported provider: " + provider);
  }

  return (result || "").trim();
}

/* ---------------- SAFE FETCH ---------------- */
async function safeFetch(url: string, options: any) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const text = await res.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response: " + text);
    }

    if (!res.ok) {
      throw new Error(
        data?.error?.message || `HTTP ${res.status}: ${text}`
      );
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

/* ---------------- GROQ ---------------- */
async function callGroq(prompt: string, apiKey: string, model: string) {
  const data = await safeFetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "llama-3.1-8b-instant",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  return data?.choices?.[0]?.message?.content || "";
}

/* ---------------- OPENAI ---------------- */
async function callOpenAI(prompt: string, apiKey: string, model: string) {
  const data = await safeFetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  return data?.choices?.[0]?.message?.content || "";
}

/* ---------------- GEMINI ---------------- */
async function callGemini(prompt: string, apiKey: string, model: string) {
  const data = await safeFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${
      model || "gemini-1.5-flash"
    }:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/* ---------------- CLAUDE ---------------- */
async function callClaude(prompt: string, apiKey: string, model: string) {
  const data = await safeFetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model || "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  return data?.content?.[0]?.text || "";
}
