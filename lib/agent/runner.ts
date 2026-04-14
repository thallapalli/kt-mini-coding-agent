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
  // unique working directory (Vercel-safe temp usage)
  const repoPath = `/tmp/repo-${Date.now()}`;

  try {
    // STEP 1: Clone repo
    onProgress?.("📦 Cloning repository...");
    await cloneRepo(repoUrl, repoPath);

    // STEP 2: Read repo structure
    onProgress?.("📚 Reading repository files...");
    const context = await buildRepoContext(repoPath);

    // STEP 3: Create AI plan
    onProgress?.("🧠 Generating plan...");
    const plan = await createPlan(prompt, context, apiKey);

    // STEP 4: Apply changes
    onProgress?.("✏️ Applying changes...");
    await applyPlan(plan, repoPath, apiKey);

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
