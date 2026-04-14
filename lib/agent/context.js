import fs from "fs";
import path from "path";

export async function buildRepoContext(repoPath: string) {
  const files: any[] = [];

  function scan(dir: string) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const full = path.join(dir, item);

      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else {
        files.push({
          path: full.replace(repoPath, ""),
        });
      }
    }
  }

  try {
    scan(repoPath);
  } catch {
    console.log("⚠️ Empty repo context (expected in Vercel)");
  }

  return { files };
}
