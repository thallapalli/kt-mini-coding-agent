import { cloneRepo, commitAndPush } from "./github";
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
  // Vercel-safe temp path (not really used now but kept for compatibility)
  const repoPath = `/tmp/repo-${Date.now()}`;

  try {
    // ✅ STEP 1: Fetch repo via GitHub API (NOT mock anymore)
    onProgress?.("📦 Fetching repo from GitHub...");
    const repoData = await cloneRepo(repoUrl, repoPath);

    const context = {
      files: repoData.files || [],
    };

    if (!context.files || context.files.length === 0) {
      throw new Error("No files found in repository");
    }

    onProgress?.(`📚 Loaded ${context.files.length} files`);

    // ✅ STEP 2: Create plan using LLM
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

    onProgress?.(`📝 Plan created with ${plan.length} steps`);

    // ✅ STEP 3: Apply changes (still simulated for now)
    onProgress?.("✏️ Applying changes...");
    await applyPlan(
      plan,
      repoPath,
      llmConfig.apiKey,
      llmConfig.provider,
      llmConfig.model
    );

    // ✅ STEP 4: Commit (mock)
    onProgress?.("📤 Committing changes...");
    await commitAndPush(repoPath, prompt);

    // DONE
    onProgress?.("✅ Done");

    return {
      success: true,
      message: "Agent completed successfully",
      filesAnalyzed: context.files.length,
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
