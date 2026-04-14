export async function cloneRepo(repoUrl: string, repoPath: string) {
  console.log("📦 Fetching repo via GitHub API...");

  const match = repoUrl.match(/github.com\/(.*?)\/(.*?)(\.git)?$/);

  if (!match) {
    throw new Error("Invalid GitHub URL");
  }

  const owner = match[1];
  const repo = match[2];

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`
  );

  const data = await res.json();

  if (!data.tree) {
    throw new Error("Failed to fetch repo tree");
  }

  const files: any[] = [];

  for (const item of data.tree) {
    if (item.type === "blob") {
      try {
        const fileRes = await fetch(item.url);
        const fileData = await fileRes.json();

        const content = Buffer.from(fileData.content, "base64").toString(
          "utf-8"
        );

        files.push({
          path: item.path,
          content: content.slice(0, 2000),
        });
      } catch (err) {
        console.log("skip file:", item.path);
      }
    }
  }

  return {
    success: true,
    repoUrl,
    repoPath,
    files,
  };
}

/**
 * ⚠️ Vercel limitation:
 * No real git push allowed in serverless
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
