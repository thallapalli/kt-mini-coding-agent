import { askLLM } from "./llm";

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[.*\]/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return null;
  }
}

export async function createPlan(
  prompt: string,
  context: any,
  apiKey: string,
  provider: string,
  model: string
) {
  const safeContext = {
    files: (context?.files || []).slice(0, 6),
  };

  const llmPrompt = `
You are a senior software engineer AI agent.

TASK:
${prompt}

REPO FILES (TRIMMED):
${JSON.stringify(safeContext, null, 2)}

Return ONLY valid JSON array:
[
  {
    "file": "path",
    "action": "edit",
    "instruction": "what to change"
  }
]
`;

  const res = await askLLM(llmPrompt, apiKey, provider, model);

  if (!res || res.trim().length === 0) {
    throw new Error("Empty LLM response");
  }

  const parsed = safeJsonParse(res);

  if (!parsed) {
    throw new Error("Invalid JSON from LLM: " + res.slice(0, 200));
  }

  return parsed;
}
