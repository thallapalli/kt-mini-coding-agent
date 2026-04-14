import fs from "fs";

export async function cloneRepo(repoUrl: string, repoPath: string) {
  console.log("📦 Preparing repo folder:", repoPath);

  // 🔥 IMPORTANT: ensure folder exists
  fs.mkdirSync(repoPath, { recursive: true });

  // ⚠️ TEMP MOCK FILES (until real git clone is added)
  fs.writeFileSync(
    `${repoPath}/README.md`,
    "# Mock Repo\nThis is a placeholder repo for testing.\n"
  );

  fs.writeFileSync(
    `${repoPath}/package.json`,
    JSON.stringify(
      {
        name: "mock-repo",
        version: "1.0.0",
      },
      null,
      2
    )
  );

  console.log("📦 Mock repo created at:", repoPath);

  return {
    success: true,
    repoUrl,
    repoPath,
  };
}
