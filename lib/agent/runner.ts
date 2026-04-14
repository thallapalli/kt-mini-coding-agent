import { cloneRepo, commitAndPush } from "./github";
import { buildRepoContext } from "./context";
import { createPlan } from "./planner";
import { applyPlan } from "./executor";

export type RunAgentInput = {
  repoUrl: string;
  prompt: string;
  llmConfig: {
    provider: string;
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
  const repoPath = `/tmp/repo-${Date.now()}`;

  try {
    onProgress?.("📦 Cloning repo...");
    await cloneRepo(repoUrl, repoPath);

    onProgress?.("📚 Building repo context...");
    const context = await buildRepoContext(repoPath);

    onProgress?.("🧠 Creating AI plan...");
    const plan = await createPlan(
      prompt,
      context,
      llmConfig.apiKey,
      llmConfig.provider,
      llmConfig.model
    );

    onProgress?.("✏️ Applying changes...");
    await applyPlan(
      plan,
      repoPath,
      llmConfig.apiKey,
      llmConfig.provider,
      llmConfig.model
    );

    onProgress?.("📤 Committing changes...");
    await commitAndPush(repoPath, prompt);

    onProgress?.("✅ Done");

    return {
      success: true,
      plan,
    };
  } catch (err: any) {
    onProgress?.("❌ Failed: " + err.message);

    return {
      success: false,
      error: err.message,
    };
  }
}
