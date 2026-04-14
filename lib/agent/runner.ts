import { cloneRepo, commitAndPush } from "./github";
import { buildRepoContext } from "./context";
import { createPlan } from "./planner";
import { applyPlan } from "./executor";

export async function runAgent({
  repoUrl,
  prompt,
  apiKey,
  onProgress,
}: {
  repoUrl: string;
  prompt: string;
  apiKey: string;
  onProgress?: (msg: string) => void;
}) {
  const repoPath = `/tmp/repo-${Date.now()}`;

  onProgress?.("📦 Cloning repo...");
  await cloneRepo(repoUrl, repoPath);

  onProgress?.("📚 Reading repo...");
  const context = await buildRepoContext(repoPath);

  onProgress?.("🧠 Planning...");
  const plan = await createPlan(prompt, context, apiKey);

  onProgress?.("✏️ Editing files...");
  await applyPlan(plan, repoPath, apiKey);

  onProgress?.("📤 Committing...");
  await commitAndPush(repoPath, prompt);

  onProgress?.("✅ Done");

  return { plan };
}
