import { cloneRepo, commitAndPush } from "./github";
import { buildRepoContext } from "./context";
import { createPlan } from "./planner";
import { applyPlan } from "./executor";

type LLMConfig = {
  provider: string;
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
  // ✅ Vercel-safe temp path
  const repoPath = `/tmp/repo-${Date.now()}`;

  try {
    // STEP 1: Clone repo (mock or real)
    onProgress?.("📦 Cloning repo...");
    await cloneRepo(repoUrl, repoPath);

    // STEP 2: Build repo context
    onProgress?.("📚 Building repo context...");
    const context = await buildRepoContext(repoPath);

    if (!context || !context.files || context.files.length === 0) {
      onProgress?.("⚠️ No files found in repo (mock mode likely)");
    }

    // STEP 3: Create plan using LLM
    onProgress?.("🧠 Creating AI plan...");
    const plan = await createPlan(
      prompt,
      context,
      llmConfig.apiKey,
      llmConfig.provider,
      llmConfig.model
    );

    if (!plan || plan.length === 0) {
      throw new Error("LLM returned empty plan");
    }

    // STEP 4: Apply changes
    onProgress?.("✏️ Applying changes...");
    await applyPlan(
      plan,
      repoPath,
      llmConfig.apiKey,
      llmConfig.provider,
      llmConfig.model
    );

    // STEP 5: Commit changes (mock in Vercel)
    onProgress?.("📤 Committing changes...");
    await commitAndPush(repoPath, prompt);

    // DONE
    onProgress?.("✅ Done");

    return {
      success: true,
      message: "Agent completed successfully",
      plan,
    };
  } catch (error: any) {
    console.error("❌ AGENT ERROR:", error);

    onProgress?.("❌ Failed: " + error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}
