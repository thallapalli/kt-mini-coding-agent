import { askLLM } from "./llm";

export async function createPlan(
  prompt: string,
  context: any,
  apiKey: string
) {
  const llmPrompt = `
You are a senior software engineer AI agent.

User task:
${prompt}

Repo files:
${JSON.stringify(context.files, null, 2)}

Return ONLY JSON:
[
  {
    "file": "path",
    "action": "edit",
    "instruction": "what to change"
  }
]
`;

  const res = await askLLM(llmPrompt, apiKey);

  try {
    return JSON.parse(res);
  } catch (e) {
    throw new Error("Invalid JSON from LLM: " + res);
  }
}
