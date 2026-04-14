import fs from "fs";
import path from "path";
import { askLLM } from "./llm";

export async function applyPlan(plan, repoPath, llmConfig) {
  for (const item of plan) {
    const filePath = path.join(repoPath, item.file);

    let current = "";

    try {
      if (fs.existsSync(filePath)) {
        current = fs.readFileSync(filePath, "utf-8");
      }
    } catch (e) {}

    const prompt = `
You are editing a file.

Instruction:
${item.instruction}

Current file content:
${current}

Return ONLY updated full file content.
`;

    const updated = await askLLM(
      prompt,
      llmConfig.apiKey,
      llmConfig.provider,
      llmConfig.model
    );

    if (!updated || updated.trim().length === 0) {
      throw new Error("Empty file update from LLM");
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, updated, "utf-8");
  }
}
