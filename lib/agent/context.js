import fs from "fs";
import path from "path";

export async function buildRepoContext(repoPath) {
  const files = [];

  function scan(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      if (fs.statSync(fullPath).isDirectory()) {
        if (!item.includes("node_modules")) {
          scan(fullPath);
        }
      } else {
        files.push(fullPath.replace(repoPath, ""));
      }
    }
  }

  scan(repoPath);

  return { files: files.slice(0, 50) };
}
