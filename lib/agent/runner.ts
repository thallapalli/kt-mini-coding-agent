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

function trimContext(context: any, maxFiles = 8) {
  if (!context?.files) return context;

  return {
    ...context,
    files: context.files
      .slice(0, maxFiles)
      .map((f: any) => ({
        path: f.path,
        content: (f.content || "").slice(0, 800), // VERY IMPORTANT
      })),
  };
}

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
    let context = await buildRepoContext(repoPath);

    // 🔥 FIX: reduce token explosion
    context = trimContext(context, 6);

    if (!context?.files?.length) {
      onProgress?.("⚠️ No files found in repo (mock mode likely)");
    }

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
