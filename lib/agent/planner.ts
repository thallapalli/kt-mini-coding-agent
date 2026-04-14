import { askLLM } from "./llm";

export async function createPlan(prompt, context, llmConfig) {
  const llmPrompt = `
You are an AI coding agent.

User request:
${prompt}

Repository context (trimmed):
${JSON.stringify(context).slice(0, 12000)}

Return ONLY valid JSON array:
[
  {
    "file": "path",
    "action": "add | update | delete",
    "instruction": "what to do"
  }
]
`;

  const res = await askLLM(
    llmPrompt,
    llmConfig.apiKey,
    llmConfig.provider,
    llmConfig.model
  );

  if (!res || res.trim().length === 0) {
    throw new Error("Empty LLM response");
  }

  try {
    return JSON.parse(res);
  } catch (e) {
    throw new Error("Invalid JSON from LLM: " + res.slice(0, 200));
  }
}
