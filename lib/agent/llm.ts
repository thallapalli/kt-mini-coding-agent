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

  result = cleanLLMOutput(result);

  if (!result || result.trim().length === 0) {
    throw new Error(`${provider} returned empty response`);
  }

  return result;
}

/* =========================================================
   🔥 NEW: CLEAN OUTPUT FIX (VERY IMPORTANT)
========================================================= */
function cleanLLMOutput(text: string) {
  if (!text) return "";

  // remove markdown ```json ... ```
  text = text.replace(/```json/g, "");
  text = text.replace(/```/g, "");

  // trim spaces/newlines
  text = text.trim();

  return text;
}

/* =========================================================
   SAFE FETCH WRAPPER
========================================================= */
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

/* =========================================================
   GROQ
========================================================= */
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
        top_p: 0.9,
        messages: [
          {
            role: "system",
            content: "Return ONLY valid JSON. No markdown. No explanation.",
          },
          { role: "user", content: prompt },
        ],
      }),
    }
  );

  return data?.choices?.[0]?.message?.content || "";
}

/* =========================================================
   OPENAI
========================================================= */
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
      top_p: 0.9,
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  return data?.choices?.[0]?.message?.content || "";
}

/* =========================================================
   GEMINI
========================================================= */
async function callGemini(prompt: string, apiKey: string, model: string) {
  const data = await safeFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${
      model || "gemini-1.5-flash"
    }:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
        },
        contents: [
          {
            parts: [
              {
                text: "Return ONLY JSON.\n\n" + prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/* =========================================================
   CLAUDE
========================================================= */
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
      temperature: 0.2,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: "Return ONLY valid JSON.\n\n" + prompt,
        },
      ],
    }),
  });

  return data?.content?.[0]?.text || "";
}
