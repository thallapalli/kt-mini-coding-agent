import { askLLM } from "./llm";

function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {}

  // 🔥 fallback: extract JSON block
  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }

  return null;
}

export async function createPlan(
  prompt: string,
  context: any,
  apiKey: string,
  provider: string,
  model: string
) {
  const trimmed = {
    files: (context?.files || []).slice(0, 5),
  };

  const llmPrompt = `
You are a STRICT JSON generator.

RULES:
- Output ONLY valid JSON
- NO explanation
- NO markdown
- NO text before or after

TASK:
${prompt}

FILES:
${JSON.stringify(trimmed)}

OUTPUT FORMAT:
[
  {
    "file": "path",
    "action": "edit",
    "instruction": "what to do"
  }
]
`;

  const res = await askLLM(llmPrompt, apiKey, provider, model);

  if (!res || res.trim().length === 0) {
    throw new Error("Empty LLM response");
  }

  const parsed = extractJSON(res);

  if (!parsed) {
    throw new Error("Invalid JSON from LLM: " + res.slice(0, 300));
  }

  return parsed;
}
