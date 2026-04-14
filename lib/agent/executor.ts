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
    if (item.action === "edit") {
      const filePath = path.join(repoPath, item.file);

      const original = fs.readFileSync(filePath, "utf-8");

      const prompt = `
You are a code editor AI.

Modify ONLY the required parts of the file.

File content:
${original}

Instruction:
${item.instruction}

Return ONLY updated full file content.
`;

      const updated = await askLLM(
        prompt,
        apiKey,
        provider,
        model
      );

      fs.writeFileSync(filePath, updated, "utf-8");
    }
  }
}
