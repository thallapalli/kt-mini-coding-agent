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
You are editing a file.

Instruction:
${item.instruction}

File content:
${original}

Return ONLY updated file content.
`;

    const updated = await askLLM(prompt, apiKey, provider, model);

    if (!updated || updated.trim().length === 0) {
      throw new Error(`Empty response for file ${item.file}`);
    }

    fs.writeFileSync(filePath, updated, "utf-8");
  }
}
