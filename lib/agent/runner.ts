import { cloneRepo, commitAndPush } from "./github";
import { buildRepoContext } from "./context";
import { createPlan } from "./planner";
import { applyPlan } from "./executor";

type RunAgentInput = {
  repoUrl: string;
  prompt: string;
  apiKey: string;
  onProgress?: (msg: string) => void;
};

export async function runAgent({
  repoUrl,
  prompt,
  apiKey,
  onProgress,
}: RunAgentInput) {
  // ⚠️ Vercel-safe temp directory
  const repoPath = `/tmp/repo-${Date.now()}`;

  try {
    onProgress?.("📦 Cloning repo...");

    await cloneRepo(repoUrl, repoPath);

    onProgress?.("📚 Building repo context...");

    const context = await buildRepoContext(repoPath);

    onProgress?.("🧠 Creating AI plan...");

    const plan = await createPlan(prompt, context, apiKey);

    onProgress?.("✏️ Applying changes...");

    await applyPlan(plan, repoPath, apiKey);

    onProgress?.("📤 Committing changes...");

    await commitAndPush(repoPath, prompt);

    onProgress?.("✅ Done");

    return {
      success: true,
      message: "Agent completed successfully",
      plan,
    };
  } catch (error: any) {
    onProgress?.("❌ Failed: " + error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}
