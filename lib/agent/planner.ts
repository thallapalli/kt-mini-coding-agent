import { askLLM } from "./llm";

export async function createPlan(
  prompt: string,
  context: any,
  apiKey: string,
  provider: string,
  model: string
) {
  const llmPrompt = `
You are a senior software engineer AI agent.

User task:
${prompt}

Repo files:
${JSON.stringify(context.files, null, 2)}

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

  if (!res) throw new Error("Empty LLM response");

  return JSON.parse(res);
}
