import { callLLM } from "../../../lib/llm"
import { getRepoTree } from "../../../lib/github"

export async function POST(req) {

try {

const body = await req.json()

const { message, model, mode, repo } = body

let repoContext = ""

if (repo) {
repoContext = await getRepoTree(repo)
}

let prompt = message

if (mode === "plan") {
prompt = `
You are a senior software engineer.

Repository structure:
${repoContext}

User request:
${message}

Create a step-by-step plan.
`
}

const reply = await callLLM({ message: prompt, model })

return Response.json({
reply: reply || "No response from AI"
})

} catch (e) {

return Response.json({
reply: "ERROR: " + e.message
})

}

}
