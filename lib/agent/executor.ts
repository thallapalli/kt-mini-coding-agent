import fs from "fs";
import { askLLM } from "./llm";

export async function applyPlan(
  plan: any[],
  repoPath: string,
  apiKey: string,
  provider: string,
  model: string
) {
  for (const item of plan || []) {
    const filePath = `${repoPath}/${item.file}`;

    try {
      if (!fs.existsSync(filePath)) continue;

      const current = fs.readFileSync(filePath, "utf-8");

      const prompt = `
You are editing a file.

Instruction:
${item.instruction}

Current file:
${current}

Return ONLY updated full file content.
`;

      const updated = await askLLM(prompt, apiKey, provider, model);

      if (updated && updated.length > 0) {
        fs.writeFileSync(filePath, updated, "utf-8");
      }
    } catch (err) {
      console.log("❌ executor error:", err);
    }
  }
}
