import { askLLM } from "./llm";

export async function createPlan(
  prompt: string,
  context: any,
  apiKey: string,
  provider: string,
  model: string
) {
  const llmPrompt = `
You are an AI coding agent.

STRICT RULES:
- Return ONLY valid JSON
- NO explanations
- NO text before or after
- NO markdown
- NO comments

Format:
[
  {
    "file": "path/to/file",
    "action": "edit",
    "instruction": "what to change"
  }
]

User request:
${prompt}

Repo files:
${JSON.stringify(context.files.slice(0, 20), null, 2)}
`;

  const raw = await askLLM(llmPrompt, apiKey, provider, model);

  if (!raw || raw.trim().length === 0) {
    throw new Error("Empty LLM response");
  }

  // 🔥 CLEAN RESPONSE (VERY IMPORTANT)
  let cleaned = raw.trim();

  // remove markdown ```
  cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "");

  // extract JSON array if extra text exists
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ RAW LLM RESPONSE:", raw);

    throw new Error("Invalid JSON from LLM:\n" + cleaned);
  }
}
