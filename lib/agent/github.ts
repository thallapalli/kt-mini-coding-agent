export async function cloneRepo(repoUrl: string, repoPath: string) {
  // 🚫 Vercel-safe mock (no git CLI allowed)

  console.log("📦 Mock clone repo:", repoUrl);
  console.log("📁 Target path:", repoPath);

  // 👉 future: replace with GitHub API download zip

  return {
    success: true,
    repoUrl,
    repoPath,
  };
}

export async function commitAndPush(repoPath: string, message: string) {
  // 🚫 Vercel-safe mock

  console.log("📤 Mock commit & push");
  console.log("📁 Path:", repoPath);
  console.log("💬 Message:", message);

  return {
    success: true,
    message,
  };
}
