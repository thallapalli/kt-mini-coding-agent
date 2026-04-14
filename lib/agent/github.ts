import simpleGit from "simple-git";

export async function cloneRepo(repoUrl: string, path: string) {
  const git = simpleGit();

  await git.clone(repoUrl, path);
}

export async function commitAndPush(repoPath: string, message: string) {
  const git = simpleGit(repoPath);

  await git.add(".");
  await git.commit(`AI AGENT: ${message}`);
  await git.push();
}
