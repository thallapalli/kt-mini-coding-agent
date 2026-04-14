export async function cloneRepo(repoUrl: string, repoPath: string) {
  console.log("📦 Mock clone repo:", repoUrl);
  console.log("📁 Target path:", repoPath);

  return {
    success: true,
    repoUrl,
    repoPath,
  };
}

/**
 * IMPORTANT: must match runner import name
 */
export async function commitAndPush(repoPath: string, message: string) {
  console.log("📤 Mock commit & push");
  console.log("📁 Path:", repoPath);
  console.log("💬 Message:", message);

  return {
    success: true,
    message,
  };
}
