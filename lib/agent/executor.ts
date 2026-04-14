import fs from "fs";
import path from "path";
import { askLLM } from "./llm";

export async function applyPlan(
  plan: any[],
  repoPath: string,
  apiKey: string,
  provider: string,
  model: string
) {
  for (const item of plan) {
    const filePath = path.join(repoPath, item.file);

    if (!fs.existsSync(filePath)) continue;

    const original = fs.readFileSync(filePath, "utf-8");

    const prompt = `
Instruction:
${item.instruction}

File:
${original}

Return updated file only.
`;

    const updated = await askLLM(prompt, apiKey, provider, model);

    fs.writeFileSync(filePath, updated, "utf-8");
  }
}
