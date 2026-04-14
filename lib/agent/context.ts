import fs from "fs";
import path from "path";

export async function buildRepoContext(repoPath: string) {
  const files: any[] = [];

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir);

    for (const file of entries) {
      const fullPath = path.join(dir, file);

      try {
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scan(fullPath);
        } else {
          // Read file safely
          let content = "";
          try {
            content = fs.readFileSync(fullPath, "utf-8").slice(0, 2000);
          } catch (e) {
            content = "BINARY_OR_UNREADABLE";
          }

          files.push({
            path: fullPath.replace(repoPath, ""),
            content,
          });
        }
      } catch (err) {
        console.log("⚠️ Skip file:", fullPath);
      }
    }
  }

  scan(repoPath);

  return { files };
}
