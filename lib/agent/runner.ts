import { cloneRepo, commitAndPush } from "./github";
import { buildRepoContext } from "./context";
import { createPlan } from "./planner";
import { applyPlan } from "./executor";

type RunAgentInput = {
  repoUrl: string;
  prompt: string;

  llmConfig: {
    provider: "groq" | "openai" | "gemini" | "claude";
    model: string;
    apiKey: string;
  };

  onProgress?: (msg: string) => void;
};

export async function runAgent({
  repoUrl,
  prompt,
  llmConfig,
  onProgress,
}: RunAgentInput) {
  // ⚠️ Vercel-safe temp directory
  const repoPath = `/tmp/repo-${Date.now()}`;

  try {
    // STEP 1: Clone repo
    onProgress?.("📦 Cloning repository...");
    await cloneRepo(repoUrl, repoPath);

    // STEP 2: Build repo context
    onProgress?.("📚 Reading repository files...");
    const context = await buildRepoContext(repoPath);

    // STEP 3: Create AI plan (multi-LLM support)
    onProgress?.(
      `🧠 Generating plan using ${llmConfig.provider} / ${llmConfig.model}...`
    );

    const plan = await createPlan(
      prompt,
      context,
      llmConfig.apiKey,
      llmConfig.provider,
      llmConfig.model
    );

    // STEP 4: Apply changes
    onProgress?.("✏️ Applying changes...");
    await applyPlan(plan, repoPath, llmConfig.apiKey);

    // STEP 5: Commit changes
    onProgress?.("📤 Committing changes...");
    await commitAndPush(repoPath, prompt);

    // DONE
    onProgress?.("✅ Completed successfully");

    return {
      success: true,
      repoPath,
      plan,
      message: "Agent finished execution",
    };
  } catch (error: any) {
    onProgress?.("❌ Error: " + error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}
