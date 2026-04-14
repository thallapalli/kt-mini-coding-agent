export async function cloneRepo(repoUrl: string, repoPath: string) {
  // ❌ DO NOT use git clone or child_process in Vercel
  // Vercel runtime will crash with ChildProcess errors

  console.log("📦 Mock clone repo:", repoUrl);
  console.log("📁 Target path:", repoPath);

  return {
    success: true,
    repoUrl,
    repoPath,
  };
}

export async function commitAndPush(repoPath: string, message: string) {
  // ❌ No git CLI in serverless

  console.log("📤 Mock commit & push");
  console.log("📁 Path:", repoPath);
  console.log("💬 Message:", message);

  return {
    success: true,
    message,
  };
}
