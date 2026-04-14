import fs from "fs";
import path from "path";

type RepoFile = {
  path: string;
  content: string;
};

export async function buildRepoContext(repoPath: string) {
  const files: RepoFile[] = [];

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // skip heavy folders
      if (
        entry.name === "node_modules" ||
        entry.name === ".git" ||
        entry.name === ".next"
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        scan(fullPath);
      } else {
        const content = fs.readFileSync(fullPath, "utf-8");

        files.push({
          path: fullPath.replace(repoPath + "/", ""),
          content: content.slice(0, 2000), // prevent token explosion
        });
      }
    }
  }

  scan(repoPath);

  console.log("📁 Files found:", files.length);

  return { files };
}
