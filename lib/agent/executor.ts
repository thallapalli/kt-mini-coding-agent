import fs from "fs";
import path from "path";
import { askLLM } from "./llm";

export async function applyPlan(plan: any[], repoPath: string, apiKey: string) {
  for (const step of plan) {
    const filePath = path.join(repoPath, step.file);

    let currentCode = "";

    if (fs.existsSync(filePath)) {
      currentCode = fs.readFileSync(filePath, "utf-8");
    }

    const prompt = `
You are editing a file.

Instruction:
${step.instruction}

Current file:
${currentCode}

Return ONLY full updated file.
`;

    const updated = await askLLM(prompt, apiKey);

    fs.writeFileSync(filePath, updated, "utf-8");
  }
}
