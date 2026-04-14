import fs from "fs";
import path from "path";

export async function buildRepoContext(repoPath: string) {
  const files: string[] = [];

  function scan(dir: string) {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  scan(repoPath);

  return { files };
}
