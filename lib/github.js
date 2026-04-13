export async function getRepoTree(repo) {

try {

const res = await fetch(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`)

const data = await res.json()

if (!data.tree) return "No repo found"

const files = data.tree
  .filter(item => item.type === "blob")
  .map(item => item.path)

return files.slice(0, 50).join("\n") // limit for now

} catch (e) {
return "Error fetching repo"
}

}
