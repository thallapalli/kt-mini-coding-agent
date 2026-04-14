import { askLLM } from "./llm";

export async function createPlan(
  prompt: string,
  context: any,
  apiKey: string
) {
  const llmPrompt = `
You are a senior software engineer AI agent.

Your job is to create a precise execution plan.

User request:
${prompt}

Repository files:
${JSON.stringify(context?.files || [], null, 2)}

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No backticks

FORMAT:
[
  {
    "file": "path/to/file",
    "action": "edit",
    "instruction": "what to change"
  }
]
`;

  const res = await askLLM(llmPrompt, apiKey);

  console.log("🧠 RAW LLM RESPONSE:\n", res);

  // ❗ guard 1: empty response
  if (!res || res.trim().length === 0) {
    throw new Error(
      "LLM returned empty response. Check API key or model availability."
    );
  }

  let cleaned = res.trim();

  // ❗ guard 2: remove accidental markdown fences if model adds them
  cleaned = cleaned
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.error("❌ Failed to parse LLM output:", cleaned);

    throw new Error(
      "Invalid JSON from LLM. Raw output: " + cleaned
    );
  }
}
