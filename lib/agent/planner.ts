import { askLLM } from "./llm";

// 🔥 MUST MATCH llm.ts EXACT TYPE
type Provider = "groq" | "openai" | "gemini" | "claude";

export async function createPlan(
  prompt: string,
  context: any,
  apiKey: string,
  provider: Provider,
  model: string
) {
  const llmPrompt = `
You are a senior software engineer AI agent.

STRICT RULE:
Return ONLY valid JSON array. No markdown. No explanation.

Format:
[
  {
    "file": "path",
    "action": "add | edit | delete | read",
    "instruction": "what to do"
  }
]

User task:
${prompt}

Repo files (trimmed):
${JSON.stringify(context.files.slice(0, 10), null, 2)}
`;

  const res = await askLLM(llmPrompt, apiKey, provider, model);

  if (!res || res.trim().length === 0) {
    throw new Error("Empty LLM response");
  }

  try {
    const cleaned = res
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.log("RAW LLM RESPONSE:", res);
    throw new Error("Invalid JSON from LLM");
  }
}
