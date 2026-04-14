import { cloneRepo, commitAndPush } from "./github";
import { buildRepoContext } from "./context";
import { createPlan } from "./planner";
import { applyPlan } from "./executor";
import { Provider } from "./types";

type LLMConfig = {
  provider: Provider; // 🔥 FIX HERE
  model: string;
  apiKey: string;
};

type RunAgentInput = {
  repoUrl: string;
  prompt: string;
  llmConfig: LLMConfig;
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
      message: "Agent completed successfully",
    };
  } catch (err: any) {
    console.error(err);
    onProgress?.("❌ Failed: " + err.message);

    return {
      success: false,
      error: err.message,
    };
  }
}
