import { callLLM } from "../../../lib/llm"
import { getRepoTree } from "../../../lib/github"

export async function POST(req) {

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
Be specific to this repo.
Do NOT write code.
`

}

const reply = await callLLM({ message: prompt, model })

return Response.json({ reply })

}
