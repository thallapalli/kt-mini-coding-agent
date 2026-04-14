import fs from "fs";
import path from "path";
import { askLLM } from "./llm";

// 🔥 SAME TYPE AS LLM FILE
type Provider = "groq" | "openai" | "gemini" | "claude";

export async function applyPlan(
  plan: any[],
  repoPath: string,
  apiKey: string,
  provider: Provider,
  model: string
) {
  for (const item of plan) {
    const filePath = path.join(repoPath, item.file);

    if (item.action === "read") continue;

    if (item.action === "add") {
      fs.writeFileSync(filePath, item.instruction, "utf-8");
    }

    if (item.action === "edit") {
      const existing = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf-8")
        : "";

      const prompt = `
You are a code editor AI.

Return ONLY updated file content.

File:
${existing}

Instruction:
${item.instruction}
`;

      const updated = await askLLM(
        prompt,
        apiKey,
        provider,   // ✅ now correctly typed
        model
      );

      if (updated && updated.trim().length > 0) {
        fs.writeFileSync(filePath, updated, "utf-8");
      }
    }
  }
}
