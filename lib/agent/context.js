import fs from "fs";
import path from "path";

export async function buildRepoContext(repoPath) {
  const files = [];

  function scan(dir) {
    try {
      const entries = fs.readdirSync(dir);

      for (const entry of entries) {
        const fullPath = path.join(dir, entry);

        try {
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            scan(fullPath);
          } else {
            files.push(fullPath);
          }
        } catch (e) {
          // ignore broken symlinks or access errors
        }
      }
    } catch (e) {
      console.log("Scan error:", e.message);
    }
  }

  scan(repoPath);

  return {
    files,
    summary: `Found ${files.length} files`,
  };
}
