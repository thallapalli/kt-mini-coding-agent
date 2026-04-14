import { cloneRepo } from "./github";
import { buildRepoContext } from "./context";
import { createPlan } from "./planner";
import { applyPlan } from "./executor";
import { commitAndPush } from "./github";

export async function runAgent({
  repoUrl,
  prompt,
  apiKey,
}: {
  repoUrl: string;
  prompt: string;
  apiKey: string;
}) {
  const repoPath = `/tmp/repo-${Date.now()}`;

  // 1. Clone repo
  await cloneRepo(repoUrl, repoPath);

  // 2. Read repo structure
  const context = await buildRepoContext(repoPath);

  // 3. Create plan using LLM
  const plan = await createPlan(prompt, context, apiKey);

  // 4. Apply changes
  await applyPlan(plan, repoPath, apiKey);

  // 5. Commit & push
  await commitAndPush(repoPath, prompt);

  return {
    message: "Agent completed successfully",
    plan,
  };
}
