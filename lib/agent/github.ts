import fs from "fs";

/**
 * MOCK CLONE (safe for Vercel)
 */
export async function cloneRepo(repoUrl: string, repoPath: string) {
  fs.mkdirSync(repoPath, { recursive: true });

  // create mock files so context NEVER fails
  fs.writeFileSync(
    `${repoPath}/README.md`,
    "# Mock Repo\nAgent working correctly\n"
  );

  fs.writeFileSync(
    `${repoPath}/package.json`,
    JSON.stringify({ name: "mock-repo", version: "1.0.0" }, null, 2)
  );

  return { success: true };
}

/**
 * IMPORTANT: MUST match runner import name exactly
 */
export async function commitAndPush(repoPath: string, message: string) {
  console.log("📤 Mock commit & push");
  console.log("path:", repoPath);
  console.log("message:", message);

  return {
    success: true,
    message,
  };
}
